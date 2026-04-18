import type { HnStory } from '@/features/articles/types/hnApi.types';
import { sortStories } from '@/features/articles/store/articlesSlice';

function story(partial: Partial<HnStory> & Pick<HnStory, 'id'>): HnStory {
  return {
    id: partial.id,
    title: partial.title ?? 't',
    url: partial.url ?? 'https://example.com',
    by: partial.by ?? 'user',
    score: partial.score ?? 0,
    time: partial.time ?? 0,
  };
}

test('sortStories orders by score descending then by time descending', () => {
  const stories = [
    story({ id: 1, score: 10, time: 100 }),
    story({ id: 2, score: 50, time: 200 }),
    story({ id: 3, score: 50, time: 300 }),
  ];

  expect(sortStories(stories, 'score').map(s => s.id)).toEqual([2, 3, 1]);

  const byTime = [
    story({ id: 10, score: 1, time: 10 }),
    story({ id: 11, score: 99, time: 5 }),
  ];
  expect(sortStories(byTime, 'time').map(s => s.id)).toEqual([10, 11]);
});
