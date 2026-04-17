import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import type { HnStory } from '@/features/articles/types/hnApi.types';
import {
  faviconUrlForDomain,
  getDomainFromUrl,
} from '@/features/articles/utils/getDomainFromUrl';
import { formatRelativeTime } from '@/features/articles/utils/formatRelativeTime';
import { AppDivider } from '@/shared/components/ui/AppDivider';
import { AppImage } from '@/shared/components/ui/AppImage';
import { AppPressable } from '@/shared/components/ui/AppPressable';
import { AppText } from '@/shared/components/ui/AppText';

type ArticleListItemProps = {
  article: HnStory;
  onOpenArticle: (articleId: number) => void;
};

export function ArticleListItem({ article, onOpenArticle }: ArticleListItemProps) {
  const domain = useMemo(() => getDomainFromUrl(article.url), [article.url]);
  const faviconUri = useMemo(
    () => faviconUrlForDomain(domain),
    [domain],
  );
  const relative = useMemo(
    () => formatRelativeTime(article.time),
    [article.time],
  );

  const onOpen = useCallback(() => {
    onOpenArticle(article.id);
  }, [article.id, onOpenArticle]);

  return (
    <View>
      <AppPressable
        onPress={onOpen}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 16,
          gap: 12,
          opacity: pressed ? 0.88 : 1,
        })}>
        <AppImage
          accessibilityIgnoresInvertColors
          source={{ uri: faviconUri }}
          style={{ width: 40, height: 40, borderRadius: 8 }}
        />
        <View style={{ flex: 1, minWidth: 0 }}>
          <AppText variant="subtitle" numberOfLines={2}>
            {article.title}
          </AppText>
          <AppText variant="caption" muted numberOfLines={1} style={{ marginTop: 4 }}>
            {domain}
          </AppText>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 6,
              gap: 12,
            }}>
            <AppText variant="caption" muted>
              {article.score} pts
            </AppText>
            <AppText variant="caption" muted>
              {relative}
            </AppText>
          </View>
        </View>
      </AppPressable>
      <AppDivider />
    </View>
  );
}
