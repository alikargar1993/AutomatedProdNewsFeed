import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ArticlesStackNavigator } from '@/app/navigation/ArticlesStackNavigator';
import { BookmarksScreen } from '@/features/bookmarks/screens/BookmarksScreen';
import type { RootTabParamList } from '@/app/navigation/types';
import { useAppTheme } from '@/shared/theme/ThemeContext';
import { AppText } from '@/shared/components/ui/AppText';
import { Icon } from '@/shared/components/ui';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator() {
  const { colors, isDark } = useAppTheme();

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
        }}>
        <Tab.Screen
          name="ArticlesTab"
          component={ArticlesStackNavigator}
          options={{
            title: 'Top stories',
            tabBarIcon: ({ color }) => (
              <Icon name="home" size={24} color={color} />
            ),
            tabBarLabel: ({ color }) => (
              <AppText variant="caption" style={{ color }}>
                Stories
              </AppText>
            ),
          }}
        />
        <Tab.Screen
          name="BookmarksTab"
          component={BookmarksScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="bookmark" size={24} color={color} />
            ),
            title: 'Bookmarks',
            tabBarLabel: ({ color }) => (
              <AppText variant="caption" style={{ color }}>
                Bookmarks
              </AppText>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
