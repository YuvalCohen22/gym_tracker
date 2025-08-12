// ─────────────────────────────────────────────────────────────
// file: src/theme.ts
// ─────────────────────────────────────────────────────────────
export const COLORS = { bg: "#000000", fg: "#FFFFFF", fgMuted: "#B5B5B5", accent: "#8A4FFF", card: "#111111", border: "#222222" } as const;
export const SPACING = { xs:6, sm:10, md:14, lg:20, xl:28 } as const;
export const RADIUS = { sm:10, md:16, lg:24, xl:28 } as const;
import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor: COLORS.bg },
  h1:{ color: COLORS.fg, fontSize:28, fontWeight:"800" },
  h2:{ color: COLORS.fg, fontSize:22, fontWeight:"700" },
  p:{ color: COLORS.fgMuted, fontSize:16 },
  button:{ backgroundColor: COLORS.accent, paddingVertical:14, paddingHorizontal:18, borderRadius:RADIUS.lg, alignItems:"center" },
  buttonText:{ color: COLORS.fg, fontSize:16, fontWeight:"800" },
  input:{ backgroundColor: COLORS.card, borderColor: COLORS.border, borderWidth:1, padding:14, color: COLORS.fg, borderRadius: RADIUS.md },
});