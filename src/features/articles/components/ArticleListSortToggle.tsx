import React from 'react';
import { View } from 'react-native';
import type { ArticleListSort } from '@/features/articles/store/articlesSlice';
import { AppPressable } from '@/shared/components/ui/AppPressable';
import { AppText } from '@/shared/components/ui/AppText';
import { useAppTheme } from '@/shared/theme/ThemeContext';

type ArticleListSortToggleProps = {
  value: ArticleListSort;
  onChange: (value: ArticleListSort) => void;
};

export function ArticleListSortToggle({
  value,
  onChange,
}: ArticleListSortToggleProps) {
  const { colors } = useAppTheme();

  const pill = (sort: ArticleListSort, label: string) => {
    const active = value === sort;
    return (
      <AppPressable
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        onPress={() => onChange(sort)}
        style={({ pressed }) => ({
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 8,
          backgroundColor: active ? colors.primary : 'transparent',
          opacity: pressed ? 0.85 : 1,
        })}>
        <AppText
          variant="caption"
          style={{ color: active ? colors.primaryContrast : colors.text }}>
          {label}
        </AppText>
      </AppPressable>
    );
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        overflow: 'hidden',
      }}>
      {pill('score', 'Score')}
      {pill('time', 'Time')}
    </View>
  );
}
