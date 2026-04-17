import { configureStore } from '@reduxjs/toolkit';
import { articlesReducer } from '@/features/articles/store/articlesSlice';
import { bookmarksReducer } from '@/features/bookmarks/store/bookmarksSlice';

export const store = configureStore({
  reducer: {
    articles: articlesReducer,
    bookmarks: bookmarksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
