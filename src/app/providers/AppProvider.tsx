import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useDispatch } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from '@/app/navigation/RootNavigator';
import { OfflineBanner } from '@/shared/components/OfflineBanner';
import { hydrateBookmarks } from '@/features/bookmarks/store/bookmarksSlice';
import { store, type AppDispatch } from '@/shared/store';
import { ThemeProvider, useAppTheme } from '@/shared/theme/ThemeContext';

function ThemedStatusBar() {
  const { isDark } = useAppTheme();
  return <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />;
}

const themedAppStyles = StyleSheet.create({
  root: { flex: 1 },
  body: { flex: 1 },
});

function ThemedApp() {
  return (
    <View style={themedAppStyles.root}>
      <ThemedStatusBar />
      <OfflineBanner />
      <View style={themedAppStyles.body}>
        <RootNavigator />
      </View>
    </View>
  );
}

function BookmarksBootstrap() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    void dispatch(hydrateBookmarks());
  }, [dispatch]);
  return null;
}

const providerStyles = StyleSheet.create({
  gestureRoot: { flex: 1 },
});

export function AppProvider() {
  return (
    <GestureHandlerRootView style={providerStyles.gestureRoot}>
      <Provider store={store}>
        <BookmarksBootstrap />
        <ThemeProvider>
          <SafeAreaProvider>
            <ThemedApp />
          </SafeAreaProvider>
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
