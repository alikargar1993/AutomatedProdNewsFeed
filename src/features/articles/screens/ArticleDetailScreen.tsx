import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Linking, ScrollView, Share, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ArticlesStackParamList } from '@/app/navigation/types';
import { loadStoryById } from '@/features/articles/store/articlesSlice';
import { getDomainFromUrl } from '@/features/articles/utils/getDomainFromUrl';
import { formatRelativeTime } from '@/features/articles/utils/formatRelativeTime';
import { toggleBookmark } from '@/features/bookmarks/store/bookmarksSlice';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { AppButton, AppScreen, AppText, Icon } from '@/shared/components/ui';
import { AppPressable } from '@/shared/components/ui/AppPressable';
import { useAppTheme } from '@/shared/theme/ThemeContext';

type Props = NativeStackScreenProps<ArticlesStackParamList, 'ArticleDetail'>;

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginTop: 10 }}>
      <AppText variant="caption" muted>
        {label}
      </AppText>
      <AppText variant="body" style={{ marginTop: 4 }}>
        {value}
      </AppText>
    </View>
  );
}

export function ArticleDetailScreen({ navigation, route }: Props) {
  const { articleId } = route.params;
  const dispatch = useAppDispatch();
  const { colors } = useAppTheme();
  const [loadError, setLoadError] = useState<string | null>(null);

  const article = useAppSelector(
    state =>
      state.articles.byId[articleId] ??
      state.articles.items.find(s => s.id === articleId),
  );
  const isBookmarked = useAppSelector(state =>
    state.bookmarks.ids.includes(articleId),
  );

  useEffect(() => {
    if (article) {
      setLoadError(null);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        await dispatch(loadStoryById(articleId)).unwrap();
      } catch (e) {
        if (!cancelled) {
          setLoadError(
            e instanceof Error ? e.message : 'Unable to load this story.',
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [article, articleId, dispatch]);

  const onToggleBookmark = useCallback(() => {
    dispatch(toggleBookmark(articleId));
  }, [articleId, dispatch]);

  const onShare = useCallback(async () => {
    if (!article) {
      return;
    }
    try {
      await Share.share({
        title: article.title,
        message: `${article.title}\n${article.url}`,
        url: article.url,
      });
    } catch {
      // user dismissed
    }
  }, [article]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <AppPressable
            accessibilityRole="button"
            accessibilityLabel="Share story"
            onPress={onShare}
            disabled={!article}
            style={({ pressed }) => ({
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 8,
              opacity: pressed || !article ? 0.6 : 1,
            })}>

            <Icon name="share" size={24} color={colors.primary} />
          </AppPressable>
          <AppPressable
            accessibilityRole="button"
            accessibilityLabel={
              isBookmarked ? 'Remove bookmark' : 'Add bookmark'
            }
            onPress={onToggleBookmark}
            style={({ pressed }) => ({
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 8,
              opacity: pressed ? 0.75 : 1,
            })}>
            <AppText variant="title" style={{ color: colors.primary }}>
              {isBookmarked ? '★' : '☆'}
            </AppText>
          </AppPressable>
        </View>
      ),
    });
  }, [
    article,
    colors.primary,
    isBookmarked,
    navigation,
    onShare,
    onToggleBookmark,
  ]);

  const surfaceStyle = useMemo(
    () => ({
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 12,
      padding: 16,
    }),
    [colors.border, colors.surface],
  );

  const relativeTime = article
    ? formatRelativeTime(article.time)
    : '';

  if (!article && loadError) {
    return (
      <AppScreen>
        <View style={{ flex: 1, padding: 20, gap: 12, justifyContent: 'center' }}>
          <AppText variant="subtitle">Story not available</AppText>
          <AppText variant="body" muted>
            {loadError}
          </AppText>
          <AppButton label="Go back" onPress={() => navigation.goBack()} />
        </View>
      </AppScreen>
    );
  }

  if (!article) {
    return (
      <AppScreen>
        <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
          <AppText variant="body" muted>
            Loading story…
          </AppText>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={surfaceStyle}>
          <AppText variant="title">{article.title}</AppText>
          <MetaRow label="Author" value={article.by || '—'} />
          <MetaRow label="Score" value={String(article.score)} />
          <MetaRow label="Posted" value={relativeTime} />
        </View>
        <View style={surfaceStyle}>
          <AppText variant="caption" muted>
            URL
          </AppText>
          <AppPressable
            accessibilityRole="link"
            onPress={() => void Linking.openURL(article.url)}
            style={({ pressed }) => ({
              marginTop: 8,
              opacity: pressed ? 0.75 : 1,
            })}>
            <AppText variant="body" style={{ color: colors.primary }}>
              {article.url}
            </AppText>
          </AppPressable>
          <AppText variant="caption" muted style={{ marginTop: 8 }}>
            {getDomainFromUrl(article.url)}
          </AppText>
        </View>
      </ScrollView>
    </AppScreen>
  );
}
