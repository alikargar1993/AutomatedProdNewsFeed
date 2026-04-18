import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { getStorageItem, setStorageItem } from '@/shared/storage/appStorage';

const STORAGE_KEY = 'bookmarked_article_ids';

async function readIds(): Promise<number[]> {
  const raw = await getStorageItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .map(value => Number(value))
      .filter(id => Number.isFinite(id));
  } catch {
    return [];
  }
}

export async function persistBookmarkIds(ids: number[]): Promise<void> {
  await setStorageItem(STORAGE_KEY, JSON.stringify(ids));
}

export const hydrateBookmarks = createAsyncThunk(
  'bookmarks/hydrate',
  async () => readIds(),
);

type BookmarksState = {
  ids: number[];
};

const initialState: BookmarksState = {
  ids: [],
};

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    toggleBookmark: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const index = state.ids.indexOf(id);
      if (index >= 0) {
        state.ids.splice(index, 1);
      } else {
        state.ids.push(id);
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(hydrateBookmarks.fulfilled, (state, action) => {
      state.ids = action.payload;
    });
  },
});

export const { toggleBookmark } = bookmarksSlice.actions;
export const bookmarksReducer = bookmarksSlice.reducer;
