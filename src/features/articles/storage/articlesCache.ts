import { mmkvStorage } from '@/shared/storage/mmkv';
import type { HnStory } from '@/features/articles/types/hnApi.types';

const STORAGE_KEY = 'articles_top_stories_cache_v1';

export type ArticlesCacheEntry = {
  stories: HnStory[];
  savedAtMs: number;
};

function isHnStory(value: unknown): value is HnStory {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const o = value as Record<string, unknown>;
  return (
    typeof o.id === 'number' &&
    typeof o.title === 'string' &&
    typeof o.url === 'string' &&
    typeof o.by === 'string' &&
    typeof o.score === 'number' &&
    typeof o.time === 'number'
  );
}

export function readArticlesCache(): ArticlesCacheEntry | null {
  const raw = mmkvStorage.getString(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }
    const rec = parsed as Record<string, unknown>;
    const stories = rec.stories;
    const savedAtMs = rec.savedAtMs;
    if (!Array.isArray(stories) || typeof savedAtMs !== 'number') {
      return null;
    }
    const valid = stories.filter(isHnStory);
    if (valid.length === 0) {
      return null;
    }
    return { stories: valid, savedAtMs };
  } catch {
    return null;
  }
}

export function writeArticlesCache(stories: HnStory[]): void {
  const entry: ArticlesCacheEntry = {
    stories,
    savedAtMs: Date.now(),
  };
  mmkvStorage.set(STORAGE_KEY, JSON.stringify(entry));
}
