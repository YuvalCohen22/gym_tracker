// ─────────────────────────────────────────────────────────────
// file: app/(setup)/onboarding.tsx
// ─────────────────────────────────────────────────────────────
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { Dimensions, FlatList, Text, TouchableOpacity, View } from "react-native";
import { COLORS, SPACING, styles } from "../../src/theme";
import { KEYS, storage } from "../../src/utils/storage";

const { width } = Dimensions.get("window");
const PAGES = [
  { title: "Build Routines", desc: "Create plans with sets & reps", key: "1" },
  { title: "Track Live", desc: "Log sets, weights in real time", key: "2" },
  { title: "Improve Fast", desc: "Insights and challenges", key: "3" },
];

export default function Onboarding(){
  const ref = useRef<FlatList>(null);
  const router = useRouter();

  const Next = ({ index }:{ index:number }) => (
    <TouchableOpacity onPress={async()=>{
      if(index < PAGES.length-1){ ref.current?.scrollToIndex({ index:index+1, animated:true }); }
      else { await storage.set(KEYS.onboardingDone,true); router.replace("/(setup)/setup-wizard"); }
    }} style={{ marginTop:SPACING.lg, backgroundColor:COLORS.accent, paddingVertical:14, borderRadius:18, alignItems:"center" }}>
      <Text style={{ color: COLORS.fg, fontWeight:"800" }}>{index < PAGES.length-1? "Next":"Get Started"}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}> 
      <FlatList 
        ref={ref} 
        data={PAGES} 
        keyExtractor={(i)=>i.key} 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index })=> (
          <View style={{ width, paddingHorizontal: SPACING.lg, justifyContent:"center", flex: 1 }}>
            <Text style={[styles.h1,{ marginBottom:10 }]}>{item.title}</Text>
            <Text style={styles.p}>{item.desc}</Text>
            <Next index={index} />
          </View>
        )}
      />
      <View style={{ paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg }}>
        <TouchableOpacity onPress={async()=>{ await storage.set(KEYS.onboardingDone,true); router.replace("/(setup)/setup-wizard"); }}>
          <Text style={{ color: COLORS.fgMuted, textAlign:"center", marginTop:SPACING.md }}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}