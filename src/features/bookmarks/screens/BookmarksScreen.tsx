import React, { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { FlatList, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from '@/app/navigation/types';
import { loadStoryById } from '@/features/articles/store/articlesSlice';
import { getDomainFromUrl } from '@/features/articles/utils/getDomainFromUrl';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { useAppTheme } from '@/shared/theme/ThemeContext';
import {
  AppDivider,
  AppPressable,
  AppScreen,
  AppText,
} from '@/shared/components/ui';

type Props = BottomTabScreenProps<RootTabParamList, 'BookmarksTab'>;

export function BookmarksScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { colors, isDark } = useAppTheme();
  const byId = useAppSelector(state => state.articles.byId);
  const bookmarkedIds = useAppSelector(state => state.bookmarks.ids);

  const missingIds = useMemo(
    () => bookmarkedIds.filter(id => !byId[id]),
    [bookmarkedIds, byId],
  );

  useEffect(() => {
    missingIds.forEach(id => {
      void dispatch(loadStoryById(id));
    });
  }, [dispatch, missingIds]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Bookmarks',
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.primary,
      headerTitleStyle: { color: colors.text },
      headerShadowVisible: !isDark,
    });
  }, [colors.primary, colors.surface, colors.text, isDark, navigation]);

  const bookmarkedStories = useMemo(
    () =>
      bookmarkedIds
        .map(id => byId[id])
        .filter((s): s is NonNullable<typeof s> => Boolean(s)),
    [bookmarkedIds, byId],
  );

  const onOpenArticle = useCallback(
    (articleId: number) => {
      navigation.navigate('ArticlesTab', {
        screen: 'ArticleDetail',
        params: { articleId },
      });
    },
    [navigation],
  );

  return (
    <AppScreen edges={['left', 'right', 'bottom']}>
      <FlatList
        data={bookmarkedStories}
        keyExtractor={item => String(item.id)}
        ListEmptyComponent={
          <View style={{ padding: 20 }}>
            <AppText variant="body" muted>
              Bookmarked stories appear here. Open a story and tap the star in the
              header to save it. Bookmarks survive app restarts.
            </AppText>
          </View>
        }
        renderItem={({ item }) => (
          <View>
            <AppPressable
              onPress={() => onOpenArticle(item.id)}
              style={({ pressed }) => ({
                paddingVertical: 14,
                paddingHorizontal: 16,
                opacity: pressed ? 0.85 : 1,
              })}>
              <AppText variant="subtitle" numberOfLines={2}>
                {item.title}
              </AppText>
              <AppText variant="caption" muted numberOfLines={1} style={{ marginTop: 6 }}>
                {getDomainFromUrl(item.url)}
              </AppText>
            </AppPressable>
            <AppDivider />
          </View>
        )}
      />
    </AppScreen>
  );
}
