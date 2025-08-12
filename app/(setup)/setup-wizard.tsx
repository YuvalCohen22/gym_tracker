// ─────────────────────────────────────────────────────────────
// file: app/(setup)/setup-wizard.tsx
// ─────────────────────────────────────────────────────────────
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { COLORS, RADIUS, SPACING, styles } from "../../src/theme";
import { KEYS, storage } from "../../src/utils/storage";

const Card = ({ label, active, onPress }:{ label:string; active?:boolean; onPress:()=>void })=> (
  <Pressable onPress={onPress} style={{ padding:16, borderRadius:RADIUS.lg, backgroundColor: active? COLORS.accent: COLORS.card, borderWidth:1, borderColor:COLORS.border, marginBottom:10 }}>
    <Text style={{ color: COLORS.fg }}>{label}</Text>
  </Pressable>
);
const Progress = ({ step, total }:{ step:number; total:number })=> (
  <View style={{ height:6, backgroundColor:COLORS.card, borderRadius:999, overflow:"hidden", marginBottom:SPACING.lg }}>
    <View style={{ height:6, width:`${(step/total)*100}%`, backgroundColor:COLORS.accent }} />
  </View>
);

export default function Setup(){
  const TOTAL=6; const [step,setStep]=useState(1);
  const [gender,setGender]=useState<string|null>(null);
  const [age,setAge]=useState(25); const [weight,setWeight]=useState(70); const [height,setHeight]=useState(170);
  const [goal,setGoal]=useState<string|null>(null); const [activityLevel,setActivityLevel]=useState<string|null>(null);
  const router = useRouter();

  useEffect(()=>{(async()=>{ const d = await storage.get<any>(KEYS.setupDraft); if(d){ setGender(d.gender??gender); setAge(d.age??age); setWeight(d.weight??weight); setHeight(d.height??height); setGoal(d.goal??goal); setActivityLevel(d.activityLevel??activityLevel); } })();},[]);
  const saveDraft = async()=>{ await storage.set(KEYS.setupDraft,{ gender, age, weight, height, goal, activityLevel }); };
  const next = async()=>{ await saveDraft(); if(step<TOTAL) setStep(step+1); else { await storage.set(KEYS.setupDone,true); router.replace("../(auth)/signup"); } };

  return (
    <View style={[styles.container,{ padding:SPACING.lg }]}> 
      <Progress step={step} total={TOTAL} />
      {step===1 && (<><Text style={styles.h2}>Gender</Text><View style={{ marginTop:SPACING.md }}>{["Male","Female","Other"].map(g=> <Card key={g} label={g} active={gender===g} onPress={()=>setGender(g)} />)}</View></>)}
      {step===2 && (<><Text style={styles.h2}>Age: {age}</Text><View style={{ height:18 }} /><Slider value={age} setValue={setAge} min={12} max={80} /></>)}
      {step===3 && (<><Text style={styles.h2}>Weight (kg): {weight}</Text><View style={{ height:18 }} /><Slider value={weight} setValue={setWeight} min={30} max={200} /></>)}
      {step===4 && (<><Text style={styles.h2}>Height (cm): {height}</Text><View style={{ height:18 }} /><Slider value={height} setValue={setHeight} min={120} max={220} /></>)}
      {step===5 && (<><Text style={styles.h2}>Primary Goal</Text><View style={{ marginTop:SPACING.md }}>{["Lose Weight","Gain Muscle","Maintain"].map(g=> <Card key={g} label={g} active={goal===g} onPress={()=>setGoal(g)} />)}</View></>)}
      {step===6 && (<><Text style={styles.h2}>Activity Level</Text><View style={{ marginTop:SPACING.md }}>{["Beginner","Intermediate","Advanced"].map(g=> <Card key={g} label={g} active={activityLevel===g} onPress={()=>setActivityLevel(g)} />)}</View></>)}

      <View style={{ flexDirection:"row", gap:12, marginTop:SPACING.lg }}>
        <TouchableOpacity onPress={()=> step>1 && setStep(step-1)} style={[styles.button,{ backgroundColor:"#1f1f1f", flex:1 }]}><Text style={styles.buttonText}>Back</Text></TouchableOpacity>
        <TouchableOpacity onPress={next} style={[styles.button,{ flex:1 }]}><Text style={styles.buttonText}>{step===TOTAL?"Finish":"Next"}</Text></TouchableOpacity>
      </View>
    </View>
  );
}

function Slider({ value, setValue, min, max }:{ value:number; setValue:(v:number)=>void; min:number; max:number }){
  return (
    <View>
      <View style={{ backgroundColor:COLORS.card, borderRadius:999, height:6 }}>
        <View style={{ height:6, width:`${((value-min)/(max-min))*100}%`, backgroundColor:COLORS.accent, borderRadius:999 }} />
      </View>
      <View style={{ flexDirection:"row", justifyContent:"space-between", marginTop:12 }}>
        <TouchableOpacity onPress={()=> setValue(Math.max(min, value-1))}><Text style={{ color:COLORS.fg }}>-</Text></TouchableOpacity>
        <TouchableOpacity onPress={()=> setValue(Math.min(max, value+1))}><Text style={{ color:COLORS.fg }}>+</Text></TouchableOpacity>
      </View>
    </View>
  );
}