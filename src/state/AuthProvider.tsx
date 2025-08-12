// ─────────────────────────────────────────────────────────────
// file: src/state/AuthProvider.tsx
// ─────────────────────────────────────────────────────────────
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
// IMPORTANT: we use your root firebase.js
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase"; // adjust path if your file is elsewhere

export type SetupData = { gender: "Male"|"Female"|"Other"|null; age:number|null; weight:number|null; height:number|null; goal:"Lose Weight"|"Gain Muscle"|"Maintain"|null; activityLevel:"Beginner"|"Intermediate"|"Advanced"|null };
export type UserProfile = { userId:string; fullName:string; email:string; profilePictureUrl?:string|null } & SetupData;

type Ctx = {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email:string, password:string)=>Promise<void>;
  signUp: (fullName:string, email:string, password:string)=>Promise<void>;
  signOutApp: ()=>Promise<void>;
  resetPassword: (email:string)=>Promise<void>;
};

const AuthCtx = createContext<Ctx | null>(null);
export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};

export function AuthProvider({ children }:{ children: React.ReactNode }){
  const [user, setUser] = useState<UserProfile|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const un = onAuthStateChanged(auth, async (fb)=>{
      if(!fb){ setUser(null); setLoading(false); return; }
      const ref = doc(db, "users", fb.uid);
      const snap = await getDoc(ref);
      const base: UserProfile = { userId: fb.uid, fullName: fb.displayName||"", email: fb.email||"", profilePictureUrl: fb.photoURL||null, gender:null, age:null, weight:null, height:null, goal:null, activityLevel:null };
      setUser(snap.exists()? (snap.data() as UserProfile) : base);
      setLoading(false);
    });
    return ()=>un();
  },[]);

  const value = useMemo<Ctx>(()=>({
    user, loading,
    async signIn(email,password){ await signInWithEmailAndPassword(auth,email,password); },
    async signUp(fullName,email,password){
      const res = await createUserWithEmailAndPassword(auth,email,password);
      await updateProfile(res.user,{ displayName: fullName });
      await setDoc(doc(db,"users",res.user.uid), { userId: res.user.uid, fullName, email, gender:null, age:null, weight:null, height:null, goal:null, activityLevel:null });
    },
    async signOutApp(){ await signOut(auth); },
    async resetPassword(email){ await sendPasswordResetEmail(auth,email); },
  }),[user,loading]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}