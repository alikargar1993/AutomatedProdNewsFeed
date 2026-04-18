import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  fetchItemById,
  fetchTopStoriesBatch,
} from '@/features/articles/api/hnApi';
import {
  readArticlesCache,
  writeArticlesCache,
} from '@/features/articles/storage/articlesCache';
import type { HnStory } from '@/features/articles/types/hnApi.types';
import { hnItemToStory } from '@/features/articles/utils/hnNormalize';

export type ArticleListSort = 'score' | 'time';

export type LoadArticlesPayload =
  | { stories: HnStory[]; fromCache: false }
  | { stories: HnStory[]; fromCache: true; cacheSavedAtMs: number };

export const loadArticles = createAsyncThunk<
  LoadArticlesPayload,
  void,
  { rejectValue: string }
>('articles/loadArticles', async (_, { rejectWithValue }) => {
  try {
    const stories = await fetchTopStoriesBatch();
    await writeArticlesCache(stories);
    return { stories, fromCache: false as const };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to load articles';
    const cached = await readArticlesCache();
    if (cached && cached.stories.length > 0) {
      return {
        stories: cached.stories,
        fromCache: true as const,
        cacheSavedAtMs: cached.savedAtMs,
      };
    }
    return rejectWithValue(message);
  }
});

export const loadStoryById = createAsyncThunk(
  'articles/loadStoryById',
  async (id: number) => {
    const raw = await fetchItemById(id);
    const story = hnItemToStory(raw);
    if (!story) {
      throw new Error('Story not found or invalid');
    }
    return story;
  },
);

function mergeById(items: HnStory[]): Record<number, HnStory> {
  const byId: Record<number, HnStory> = {};
  for (const s of items) {
    byId[s.id] = s;
  }
  return byId;
}

type ArticlesState = {
  items: HnStory[];
  byId: Record<number, HnStory>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  /** True when the list comes from disk after the network request failed. */
  showingStaleCache: boolean;
  /** Unix ms when that cached list was saved (only when `showingStaleCache`). */
  staleCacheSavedAtMs: number | null;
  listSort: ArticleListSort;
  listScrollOffset: number;
};

const initialState: ArticlesState = {
  items: [],
  byId: {},
  status: 'idle',
  error: null,
  showingStaleCache: false,
  staleCacheSavedAtMs: null,
  listSort: 'score',
  listScrollOffset: 0,
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setListSort: (state, action: PayloadAction<ArticleListSort>) => {
      state.listSort = action.payload;
    },
    setListScrollOffset: (state, action: PayloadAction<number>) => {
      state.listScrollOffset = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadArticles.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadArticles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { stories, fromCache } = action.payload;
        state.items = stories;
        state.byId = mergeById(stories);
        if (fromCache) {
          state.showingStaleCache = true;
          state.staleCacheSavedAtMs = action.payload.cacheSavedAtMs;
        } else {
          state.showingStaleCache = false;
          state.staleCacheSavedAtMs = null;
        }
      })
      .addCase(loadArticles.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (typeof action.payload === 'string' ? action.payload : null) ??
          action.error.message ??
          'Failed to load articles';
      })
      .addCase(loadStoryById.fulfilled, (state, action) => {
        const story = action.payload;
        state.byId[story.id] = story;
        if (!state.items.some(s => s.id === story.id)) {
          state.items.push(story);
        }
      });
  },
});

export const { setListSort, setListScrollOffset } = articlesSlice.actions;
export const articlesReducer = articlesSlice.reducer;

export function sortStories(stories: HnStory[], sort: ArticleListSort): HnStory[] {
  const copy = [...stories];
  if (sort === 'score') {
    copy.sort((a, b) => b.score - a.score);
  } else {
    copy.sort((a, b) => b.time - a.time);
  }
  return copy;
}
