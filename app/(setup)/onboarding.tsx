// ─────────────────────────────────────────────────────────────
// file: app/(setup)/onboarding.tsx
// ─────────────────────────────────────────────────────────────
import { BlurView } from 'expo-blur';
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { Dimensions, FlatList, Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { COLORS, SPACING, styles } from "../../src/theme";
import { KEYS, storage } from "../../src/utils/storage";

const { width } = Dimensions.get("window");
const PAGES = [
  { 
    title: "Build Routines", 
    desc: "Create plans with sets & reps", 
    key: "1",
    image: {uri: "https://images.pexels.com/photos/260352/pexels-photo-260352.jpeg?_gl=1*1n2terq*_ga*MTEwMTMxNDU5OC4xNzU1MDcwMDI4*_ga_8JE65Q40S6*czE3NTUwNzAwMjckbzEkZzEkdDE3NTUwNzA2OTIkajQ3JGwwJGgw"}
  },
  { 
    title: "Track Live", 
    desc: "Log sets, weights in real time", 
    key: "2",
    image: {uri: "https://images.pexels.com/photos/33387759/pexels-photo-33387759.jpeg?_gl=1*8m2akk*_ga*MTEwMTMxNDU5OC4xNzU1MDcwMDI4*_ga_8JE65Q40S6*czE3NTUwNzAwMjckbzEkZzEkdDE3NTUwNzA3OTUkajQ3JGwwJGgw"}
  },
  { 
    title: "Improve Fast", 
    desc: "Insights and challenges", 
    key: "3",
    image: {uri: "https://images.pexels.com/photos/7005246/pexels-photo-7005246.jpeg?_gl=1*c7cvmv*_ga*MTEwMTMxNDU5OC4xNzU1MDcwMDI4*_ga_8JE65Q40S6*czE3NTUwNzAwMjckbzEkZzEkdDE3NTUwNzA4NzckajI5JGwwJGgw"}
  },
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
    <ImageBackground 
      source={ {uri: "https://as2.ftcdn.net/v2/jpg/06/81/61/85/1000_F_681618550_kn7a2aawldTDfrzphDfTbeWAt1uxIykT.jpg"} }
      style={[styles.container, { flex: 1 }]}
      resizeMode="cover"
    >
      {/* Blur Overlay */}
      <BlurView intensity={50} tint="dark" style={{ flex: 1 }}>
        <View style={{ 
          flex: 1, 
          backgroundColor: 'rgba(0, 0, 0, 0.3)'
        }}>
          <FlatList 
            ref={ref} 
            data={PAGES} 
            keyExtractor={(i)=>i.key} 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index })=> (
              <View style={{ width, paddingHorizontal: SPACING.lg, justifyContent:"center", flex: 1 }}>
                <View style={{ alignItems: "center", marginBottom: SPACING.xl }}>
                  <Image 
                    source={item.image} 
                    style={{ 
                      width: width * 0.6, 
                      height: width * 0.6, 
                      resizeMode: "contain",
                      marginBottom: SPACING.lg 
                    }} 
                  />
                </View>
                <Text style={[styles.h1,{ marginBottom:10, textAlign: "center", color: 'white' }]}>{item.title}</Text>
                <Text style={[styles.p, { textAlign: "center", marginBottom: SPACING.lg, color: 'rgba(255, 255, 255, 0.8)' }]}>{item.desc}</Text>
                <Next index={index} />
              </View>
            )}
          />
          <View style={{ paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg }}>
            <TouchableOpacity onPress={async()=>{ await storage.set(KEYS.onboardingDone,true); router.replace("/(setup)/setup-wizard"); }}>
              <Text style={{ color: 'rgba(255, 255, 255, 0.6)', textAlign:"center", marginTop:SPACING.md }}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </ImageBackground>
  );
}