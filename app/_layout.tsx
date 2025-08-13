// ─────────────────────────────────────────────────────────────
// file: app/_layout.tsx  (root layout)
// ─────────────────────────────────────────────────────────────
import * as LocalAuthentication from "expo-local-authentication";
import { Slot, SplashScreen, usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { AuthProvider, useAuth } from "../src/state/AuthProvider";
import { COLORS } from "../src/theme";
import { KEYS, storage } from "../src/utils/storage";

SplashScreen.preventAutoHideAsync();

function Gate(){
  const { user, loading } = useAuth();
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [setupDone, setSetupDone] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(()=>{(async()=>{
    setOnboarded(!!(await storage.get<boolean>(KEYS.onboardingDone)));
    setSetupDone(!!(await storage.get<boolean>(KEYS.setupDone)));
    setReady(true);
    SplashScreen.hideAsync();
  })();},[]);

  // Prompt biometrics after first login (once)
  useEffect(()=>{(async()=>{
    if(user){
      const enabled = await storage.get<boolean>(KEYS.biometricsEnabled);
      const prompted = await storage.get<boolean>(KEYS.biometricsPrompted);
      if(!enabled && !prompted){
        const ok = await LocalAuthentication.hasHardwareAsync();
        const en = await LocalAuthentication.isEnrolledAsync();
        if(ok && en){
          const res = await LocalAuthentication.authenticateAsync({ promptMessage: "Enable biometrics for quick login" });
          if(res.success) await storage.set(KEYS.biometricsEnabled,true);
        }
      }
    }
  })();},[user]);

  useEffect(()=>{
    if(!ready || loading) return;
    // Decide where to send the user
    if(!onboarded){ router.replace("/(setup)/onboarding"); return; }
    if(onboarded && !setupDone){ router.replace("/(setup)/setup-wizard"); return; }
    if(setupDone && !user){ router.replace("/(setup)/onboarding"); return; }  // needs to change back to /(auth)/login
    if(setupDone && user){ if(pathname?.startsWith("/(setup)") || pathname?.startsWith("/(auth)")) router.replace("/(tabs)"); }
  },[ready, loading, onboarded, setupDone, user]);

  if(!ready){ return <View style={{ flex:1, backgroundColor: COLORS.bg, alignItems:"center", justifyContent:"center" }}><Text style={{ color: COLORS.accent, fontSize:36, fontWeight:"900" }}>GYM TRACKER</Text></View>; }
  return <Slot />;
}

export default function RootLayout(){
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}