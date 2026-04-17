import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useAppTheme } from '@/shared/theme/ThemeContext';

const ROW_COUNT = 10;

export function ArticleListSkeleton() {
  const { colors } = useAppTheme();

  const rowStyle = useMemo(
    () => ({
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingVertical: 12,
      paddingHorizontal: 16,
      gap: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    }),
    [colors.border],
  );

  return (
    <View style={{ flex: 1 }}>
      {Array.from({ length: ROW_COUNT }, (_, i) => (
        <View key={i} style={rowStyle}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              backgroundColor: colors.border,
            }}
          />
          <View style={{ flex: 1, gap: 8 }}>
            <View
              style={{
                height: 14,
                borderRadius: 4,
                backgroundColor: colors.border,
                width: '88%',
              }}
            />
            <View
              style={{
                height: 12,
                borderRadius: 4,
                backgroundColor: colors.border,
                width: '55%',
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                gap: 12,
                marginTop: 4,
              }}>
              <View
                style={{
                  height: 10,
                  width: 48,
                  borderRadius: 4,
                  backgroundColor: colors.border,
                }}
              />
              <View
                style={{
                  height: 10,
                  width: 56,
                  borderRadius: 4,
                  backgroundColor: colors.border,
                }}
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
