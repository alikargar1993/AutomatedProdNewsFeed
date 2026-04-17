# AutomatedProsNewsFeed

React Native app that shows Hacker News top stories, article details, bookmarks, and basic offline handling.

## 1. Requirements

- **Node.js** `>= 22.11.0` (see `package.json` `engines`)
- **Yarn** for JavaScript dependencies
- **React Native development environment** for your target platform:
  - Follow the official guide: [Set up your environment](https://reactnative.dev/docs/set-up-your-environment) (Xcode and CocoaPods for iOS, Android Studio / SDK and JDK for Android)
- **iOS only:** Ruby **Bundler** and **CocoaPods** (via `bundle install` / `bundle exec pod install` in `ios/`)
- **Network:** the app loads data from the [Hacker News Firebase API](https://github.com/HackerNews/API) (`https://hacker-news.firebaseio.com/v0/`)

## 2. Installation

From the project root:

1. **Install JavaScript dependencies**

   ```sh
   yarn install
   ```

2. **iOS native dependencies** (first clone or whenever native deps change)

   ```sh
   cd ios && bundle install && bundle exec pod install && cd ..
   ```

3. **Start Metro** (JavaScript bundler)

   ```sh
   yarn start
   ```

4. **Run the app** (with Metro running, in another terminal)

   ```sh
   yarn ios
   # or
   yarn android
   ```

Other scripts: `yarn lint`, `yarn test`.

## 3. App features (and libraries)

| Feature | What it does | Library |
| --- | --- | --- |
| **Top stories list** | Fetches top story IDs and story payloads from the Hacker News API, shows a scrollable list with loading and error states. | **axios** (HTTP client), **@reduxjs/toolkit** + **react-redux** (fetch orchestration and list state) |
| **Sort stories** | Toggles ordering by score or by time for the loaded batch. | **@reduxjs/toolkit** (slice state; no extra UI library) |
| **Article detail** | Opens a story from the stack; can load a missing item by ID; open in browser / share via system APIs. | **@react-navigation/native-stack** (stack screen + types), **@reduxjs/toolkit** (`loadStoryById`), **axios** (item fetch) |
| **Bookmarks** | Save or remove bookmarked story IDs; list bookmarked items in a separate tab. | **@reduxjs/toolkit** + **react-redux** (bookmark state), **react-native-mmkv** (persisted ID list) |
| **Cached articles** | After a successful fetch, caches the story batch to disk; on network failure, can show the last cached list as stale. | **react-native-mmkv** (JSON cache), **@reduxjs/toolkit** (`loadArticles` fallback) |
| **Tab + stack navigation** | Bottom tabs for “Stories” vs “Bookmarks”; nested stack for list → detail inside the stories tab. | **@react-navigation/native**, **@react-navigation/bottom-tabs**, **@react-navigation/native-stack**, **react-native-screens** (native stack backing), **react-native-safe-area-context** (safe areas in layout) |
| **Offline banner** | Shows a banner when the device has no connection or the internet is unreachable. | **@react-native-community/netinfo**, **react-native-safe-area-context** (padding under status bar) |
| **Light / dark theme** | Follows system appearance or a stored preference (light / dark / system). | **react-native** `useColorScheme`, **react-native-mmkv** (persisted preference), **@react-navigation/native** themes for navigation chrome |
| **Icons (home, bookmark, etc.)** | Vector tab and header icons tinted by theme. | **react-native-svg** |
| **App shell** | Root providers so navigation, gestures, Redux, and safe areas work together. | **react-native-gesture-handler** (`GestureHandlerRootView`; expected by React Navigation), **react-redux** `Provider`, **react-native-safe-area-context** `SafeAreaProvider` |
