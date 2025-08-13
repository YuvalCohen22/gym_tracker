// ─────────────────────────────────────────────────────────────
// file: app/(setup)/onboarding.tsx
// ─────────────────────────────────────────────────────────────
import { BlurView } from 'expo-blur';
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
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
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleGetStarted = async () => {
    await storage.set(KEYS.onboardingDone, true);
    router.replace("/(setup)/setup-wizard");
  };

  return (
    <ImageBackground 
      source={ {uri: "https://as2.ftcdn.net/v2/jpg/06/81/61/85/1000_F_681618550_kn7a2aawldTDfrzphDfTbeWAt1uxIykT.jpg"} }
      style={[styles.container, { flex: 1 }]}
      resizeMode="cover"
    >
      {/* Blur Overlay */}
      <BlurView intensity={35} tint="dark" style={{ flex: 1 }}>
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
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentIndex(index);
            }}
            renderItem={({ item, index })=> (
              <View style={{ width, paddingHorizontal: SPACING.lg, justifyContent:"space-between", flex: 1, paddingVertical: SPACING.xl }}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <View style={{
                    width: width * 0.85,
                    height: width * 0.85 * 1.5,
                    borderRadius: 24,
                    overflow: 'hidden',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Image 
                      source={item.image} 
                      style={{ 
                        width: '100%',
                        height: '100%',
                        resizeMode: "cover"
                      }} 
                    />
                  </View>
                </View>

                <View style={{ paddingTop: SPACING.lg }}>
                  <Text style={[styles.h1,{ marginBottom: SPACING.sm, textAlign: "center", color: 'white', fontSize: 28, fontWeight: 'bold' }]}>{item.title}</Text>
                  <Text style={[styles.p, { textAlign: "center", marginBottom: SPACING.xl, color: 'rgba(255, 255, 255, 0.8)', fontSize: 16, lineHeight: 24 }]}>{item.desc}</Text>
                  
                  <View style={{ height: 60 + SPACING.lg }}>
                    {index === PAGES.length - 1 && (
                      <TouchableOpacity 
                        onPress={handleGetStarted} 
                        style={{ 
                          marginTop: SPACING.lg, 
                          backgroundColor: COLORS.accent, 
                          paddingVertical: 14, 
                          borderRadius: 18, 
                          alignItems: "center" 
                        }}
                      >
                        <Text style={{ color: COLORS.fg, fontWeight: "800" }}>Get Started</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            )}
          />
          
          {/* Page Indicators */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'center', 
            alignItems: 'center',
            paddingHorizontal: SPACING.lg,
            paddingBottom: SPACING.md
          }}>
            {PAGES.map((_, index) => (
              <View
                key={index}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.3)',
                  marginHorizontal: 4,
                }}
              />
            ))}
          </View>
          
          <View style={{ paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl }}>
            <TouchableOpacity style={{ marginBottom: -1 }} onPress={handleGetStarted}>
              <Text style={{ color: 'rgba(255, 255, 255, 0.6)', textAlign:"center", marginTop:SPACING.md }}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </ImageBackground>
  );
}