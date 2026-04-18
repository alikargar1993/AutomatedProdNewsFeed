# ApNews

React Native app that shows Hacker News top stories, article details, bookmarks, and basic offline handling.

## Screenshots & GIFs

Add screenshots and demo GIFs under `screenshots/` (or any path you prefer) and update the links below.

| | |
| :---: | :---: |
| ![Stories / home — replace caption and path](screenshots/home.png) | ![Article or bookmarks — replace caption and path](screenshots/detail.png) |

![App walkthrough — replace caption and path](screenshots/demo.gif)

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

## 4. Technical interview responses

Short answers we can unpack in the interview.

### Q1 — Bridge vs JSI and the new architecture

The old bridge sends JSON-style messages between JS and native in a queue, so busy screens spend a lot of time packing and unpacking data instead of updating the UI. JSI lets JS call native more directly through C++, which cuts that overhead and helps scrolling and taps feel snappier. Fabric is the new UI renderer; TurboModules load native modules on demand instead of all at once at startup.

### Q2 — Diagnosing a janky `FlatList` on mid-range Android

I check whether JS or the UI thread is slow (RN perf overlay, Android Studio tools, React DevTools) before changing code. For `FlatList` I memoize rows, keep `renderItem` and `keyExtractor` stable, tune `windowSize` / `maxToRenderPerBatch` / `initialNumToRender`, use `getItemLayout` when row height is known, turn on `removeClippedSubviews` when it is safe, and keep images small or fixed-size. If it is still slow, **RecyclerListView** is a stronger list engine for huge feeds; it needs more setup than `FlatList` but often scrolls smoother.

### Q3 — `useCallback` and `useMemo` in the real world

In this app, `ArticleListScreen` uses `useMemo` for sorted and filtered lists and the offline notice text, and `useCallback` for refresh, scroll, and sort handlers so the list does not get new function props every render. `ArticleListItem` memoizes strings like the hostname and time, and `useCallback` for tap. `ThemeContext` memoizes the context value and stable setters so theme consumers do not re-render for no reason. I do not wrap every line in hooks—only where it clearly cuts extra work.

### Q4 — Context API vs Redux Toolkit vs Zustand for a twelve-screen app

**Context** is a good fit for auth, session, or theme—things that change slowly—not for huge app state that updates all the time, unless you split it into small providers. **Zustand** is a small store for shared UI or cart-style state with little boilerplate. **Redux Toolkit** helps when you want clear actions, DevTools, RTK Query, or the team already knows Redux. Here, Redux holds articles and bookmarks; Context holds theme.

### Q5 — Offline-first UX for a screen that must stay usable

Show last good data or a skeleton right away, then try to refresh; say clearly when data is old instead of spinning forever. Use NetInfo plus real fetch errors (timeouts, retries) because “wifi on” is not the same as “API works.” Save the last successful response in MMKV (or a DB if you need queries) and refresh on pull, app resume, or a simple TTL. Easier offline reads mean more stale risk and more storage; offline writes need a plan for syncing conflicts, so I spell out what works offline and what does not.
