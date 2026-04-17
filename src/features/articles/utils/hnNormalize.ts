import type { HnItemDto, HnStory } from '@/features/articles/types/hnApi.types';

export function isHnStoryWithUrl(
  item: HnItemDto | null | undefined,
): item is HnItemDto & { type: 'story'; url: string } {
  return (
    item != null &&
    item.type === 'story' &&
    typeof item.url === 'string' &&
    item.url.length > 0
  );
}

export function hnItemToStory(item: HnItemDto | null | undefined): HnStory | null {
  if (!isHnStoryWithUrl(item)) {
    return null;
  }
  return {
    id: item.id,
    title: item.title ?? 'Untitled',
    url: item.url,
    by: item.by ?? '',
    score: typeof item.score === 'number' ? item.score : 0,
    time: typeof item.time === 'number' ? item.time : 0,
  };
}
