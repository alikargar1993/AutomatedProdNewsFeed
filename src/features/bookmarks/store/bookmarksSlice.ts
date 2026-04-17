import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { mmkvStorage } from '@/shared/storage/mmkv';

const STORAGE_KEY = 'bookmarked_article_ids';

function readIds(): number[] {
  const raw = mmkvStorage.getString(STORAGE_KEY);
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

function writeIds(ids: number[]) {
  mmkvStorage.set(STORAGE_KEY, JSON.stringify(ids));
}

type BookmarksState = {
  ids: number[];
};

const initialState: BookmarksState = {
  ids: readIds(),
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
      writeIds(state.ids);
    },
  },
});

export const { toggleBookmark } = bookmarksSlice.actions;
export const bookmarksReducer = bookmarksSlice.reducer;
