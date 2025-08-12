// ─────────────────────────────────────────────────────────────
// file: src/utils/storage.ts
// ─────────────────────────────────────────────────────────────
import AsyncStorage from "@react-native-async-storage/async-storage";
export const storage = {
  async get<T=any>(key:string){ const v = await AsyncStorage.getItem(key); return v? JSON.parse(v) as T : null; },
  async set(key:string, value:any){ await AsyncStorage.setItem(key, JSON.stringify(value)); },
  async remove(key:string){ await AsyncStorage.removeItem(key); },
};
export const KEYS = { onboardingDone:"onboardingDone", setupDraft:"setupDraft", setupDone:"setupDone", biometricsPrompted:"biometricsPrompted", biometricsEnabled:"biometricsEnabled" } as const;