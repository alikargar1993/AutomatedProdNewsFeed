import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FlatList, RefreshControl, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import type { HnStory } from '@/features/articles/types/hnApi.types';
import { ArticleListItem } from '@/features/articles/components/ArticleListItem';
import { ArticleListSkeleton } from '@/features/articles/components/ArticleListSkeleton';
import { ArticleListSortToggle } from '@/features/articles/components/ArticleListSortToggle';
import {
  loadArticles,
  setListScrollOffset,
  setListSort,
  sortStories,
  type ArticleListSort,
} from '@/features/articles/store/articlesSlice';
import type { ArticlesStackParamList } from '@/app/navigation/types';
import { ThemeHeaderButton } from '@/shared/components/ThemeHeaderButton';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import {
  AppButton,
  AppScreen,
  AppText,
} from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme/ThemeContext';
import { formatRelativeTime } from '@/features/articles/utils/formatRelativeTime';

type Props = NativeStackScreenProps<ArticlesStackParamList, 'ArticleList'>;

const SEARCH_DEBOUNCE_MS = 300;

function storyMatchesSearch(story: HnStory, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) {
    return true;
  }
  return (
    story.title.toLowerCase().includes(q) ||
    story.by.toLowerCase().includes(q) ||
    story.url.toLowerCase().includes(q)
  );
}

export function ArticleListScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { colors } = useAppTheme();

  const flatListRef = useRef<FlatList<HnStory>>(null);
  const {
    items,
    status,
    error,
    listSort,
    listScrollOffset,
    showingStaleCache,
    staleCacheSavedAtMs,
  } = useAppSelector(state => state.articles);

  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchText), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [searchText]);

  const sortedItems = useMemo(
    () => sortStories(items, listSort),
    [items, listSort],
  );

  const displayItems = useMemo(
    () => sortedItems.filter(s => storyMatchesSearch(s, debouncedSearch)),
    [sortedItems, debouncedSearch],
  );

  const staleCacheNotice = useMemo(() => {
    if (!showingStaleCache || staleCacheSavedAtMs == null) {
      return null;
    }
    const when = formatRelativeTime(Math.floor(staleCacheSavedAtMs / 1000));
    return `Could not refresh the feed. Showing saved stories from ${when}. Pull to refresh to try again.`;
  }, [showingStaleCache, staleCacheSavedAtMs]);

  const onSortChange = useCallback(
    (sort: ArticleListSort) => {
      dispatch(setListSort(sort));
    },
    [dispatch],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <ArticleListSortToggle value={listSort} onChange={onSortChange} />
          <ThemeHeaderButton />
        </View>
      ),
    });
  }, [listSort, navigation, onSortChange]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadArticles());
    }
  }, [dispatch, status]);

  useFocusEffect(
    useCallback(() => {
      if (listScrollOffset <= 0 || displayItems.length === 0) {
        return;
      }
      const id = requestAnimationFrame(() => {
        flatListRef.current?.scrollToOffset({
          offset: listScrollOffset,
          animated: false,
        });
      });
      return () => cancelAnimationFrame(id);
    }, [listScrollOffset, displayItems.length]),
  );

  const onRefresh = useCallback(() => {
    dispatch(setListScrollOffset(0));
    dispatch(loadArticles());
  }, [dispatch]);

  const onScroll = useCallback(
    (e: { nativeEvent: { contentOffset: { y: number } } }) => {
      dispatch(setListScrollOffset(e.nativeEvent.contentOffset.y));
    },
    [dispatch],
  );

  if (status === 'loading' && items.length === 0) {
    return (
      <AppScreen edges={['left', 'right', 'bottom']}>
        <ArticleListSkeleton />
      </AppScreen>
    );
  }

  if (status === 'failed') {
    return (
      <AppScreen>
        <View style={{ flex: 1, padding: 20, gap: 12, justifyContent: 'center' }}>
          <AppText variant="subtitle">Something went wrong</AppText>
          <AppText variant="body" muted>
            {error}
          </AppText>
          <AppButton label="Try again" onPress={onRefresh} />
        </View>
      </AppScreen>
    );
  }

  const listEmptyMessage =
    sortedItems.length > 0 && displayItems.length === 0 && debouncedSearch.trim() !== ''
      ? 'No stories match your search.'
      : 'No stories with links in the first batch. Pull to refresh to try again.';

  return (
    <AppScreen edges={['left', 'right', 'bottom']}>
      <View style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 }}>
          {staleCacheNotice != null ? (
            <View
              style={{
                marginBottom: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 10,
                backgroundColor: colors.offlineBanner,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              accessibilityRole="alert"
            >
              <AppText variant="caption" style={{ color: colors.offlineBannerText }}>
                {staleCacheNotice}
              </AppText>
            </View>
          ) : null}
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search stories…"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
            accessibilityLabel="Search stories"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 14,
              paddingVertical: 10,
              fontSize: 16,
              color: colors.text,
            }}
          />
        </View>
        <FlatList
          ref={flatListRef}
          data={displayItems}
          keyExtractor={item => String(item.id)}
          refreshControl={
            <RefreshControl refreshing={status === 'loading'} onRefresh={onRefresh} />
          }
          onScroll={onScroll}
          scrollEventThrottle={32}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <ArticleListItem
              article={item}
              onOpenArticle={articleId =>
                navigation.navigate('ArticleDetail', { articleId })
              }
            />
          )}
          ListEmptyComponent={
            <View style={{ padding: 24 }}>
              <AppText variant="body" muted>
                {listEmptyMessage}
              </AppText>
            </View>
          }
        />
      </View>
    </AppScreen>
  );
}
