import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
} from '@reduxjs/toolkit';
import { articlesReducer } from '@/features/articles/store/articlesSlice';
import {
  bookmarksReducer,
  persistBookmarkIds,
  toggleBookmark,
} from '@/features/bookmarks/store/bookmarksSlice';

const rootReducer = combineReducers({
  articles: articlesReducer,
  bookmarks: bookmarksReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const bookmarksListener = createListenerMiddleware<RootState>();

bookmarksListener.startListening({
  actionCreator: toggleBookmark,
  effect: async (_action, listenerApi) => {
    const ids = listenerApi.getState().bookmarks.ids;
    await persistBookmarkIds(ids);
  },
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().prepend(bookmarksListener.middleware),
});

export type AppDispatch = typeof store.dispatch;
