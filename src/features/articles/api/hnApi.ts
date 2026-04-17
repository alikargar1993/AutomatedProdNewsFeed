import axios from 'axios';
import type { HnItemDto, HnStory, HnTopStoryIdsResponse } from '@/features/articles/types/hnApi.types';
import { hnItemToStory } from '@/features/articles/utils/hnNormalize';

const hnClient = axios.create({
  baseURL: 'https://hacker-news.firebaseio.com/v0',
  timeout: 20000,
});

export async function fetchTopStoryIds(): Promise<HnTopStoryIdsResponse> {
  const { data } = await hnClient.get<HnTopStoryIdsResponse>('/topstories.json');
  return data;
}

export async function fetchItemById(id: number): Promise<HnItemDto | null> {
  const { data } = await hnClient.get<HnItemDto | null>(`/item/${id}.json`);
  return data ?? null;
}

/**
 * Loads the first 20 top story IDs, fetches each item in parallel, then keeps only
 * `type === 'story'` with a URL.
 */
export async function fetchTopStoriesBatch(): Promise<HnStory[]> {
  const ids = await fetchTopStoryIds();
  const first20 = ids.slice(0, 20);
  const rawItems = await Promise.all(
    first20.map(id => fetchItemById(id)),
  );
  return rawItems
    .map(hnItemToStory)
    .filter((s): s is HnStory => s != null);
}
