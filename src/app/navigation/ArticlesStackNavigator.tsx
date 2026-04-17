import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ArticleDetailScreen } from '@/features/articles/screens/ArticleDetailScreen';
import { ArticleListScreen } from '@/features/articles/screens/ArticleListScreen';
import type { ArticlesStackParamList } from '@/app/navigation/types';
import { useAppTheme } from '@/shared/theme/ThemeContext';

const Stack = createNativeStackNavigator<ArticlesStackParamList>();

export function ArticlesStackNavigator() {
  const { colors, isDark } = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.primary,
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.text },
        headerShadowVisible: !isDark,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen
        name="ArticleList"
        component={ArticleListScreen}
        options={{ title: 'Top stories' }}
      />
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{ title: 'Article' }}
      />
    </Stack.Navigator>
  );
}
