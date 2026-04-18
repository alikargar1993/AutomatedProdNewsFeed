import AsyncStorage from '@react-native-async-storage/async-storage';

const NAMESPACE = 'automated-pros-news-feed:';

export function storageKey(key: string): string {
  return `${NAMESPACE}${key}`;
}

export async function getStorageItem(key: string): Promise<string | null> {
  return AsyncStorage.getItem(storageKey(key));
}

export async function setStorageItem(key: string, value: string): Promise<void> {
  await AsyncStorage.setItem(storageKey(key), value);
}
