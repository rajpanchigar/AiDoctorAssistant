import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  ToastAndroid,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db, auth } from "../configs/FirebaseConfigs";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const PRIMARY = "#3478F6";

/* ─────────────── tiny reusable components ─────────────── */

function ConfidenceMeter({ score }) {
  const pct = Math.min(Math.max(Number(score) || 0, 0), 100);
  const color =
    pct >= 75 ? "#EF4444" : pct >= 50 ? "#F97316" : "#22C55E";
  return (
    <View style={styles.confidenceWrap}>
      <View style={styles.confidenceRow}>
        <Text style={styles.confidenceLabel}>Confidence Score</Text>
        <Text style={[styles.confidencePct, { color }]}>{pct}%</Text>
      </View>
      <View style={styles.confidenceBar}>
        <View
          style={[
            styles.confidenceFill,
            { width: `${pct}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

function SectionCard({ iconName, title, children }) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconWrap}>
          <MaterialCommunityIcons name={iconName} size={18} color={PRIMARY} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function BulletItem({ text, icon = null, iconColor = PRIMARY }) {
  return (
    <View style={styles.bulletItem}>
      {icon ? (
        <Ionicons
          name={icon}
          size={15}
          color={iconColor}
          style={{ marginTop: 2, flexShrink: 0 }}
        />
      ) : (
        <View style={[styles.dot, { backgroundColor: PRIMARY }]} />
      )}
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

function YesNoBadge({ value, trueLabel = "Yes", falseLabel = "No" }) {
  const yes = value === true || value === "true";
  return (
    <View
      style={[
        styles.ynBadge,
        { backgroundColor: yes ? "#FEE2E2" : "#DCFCE7" },
      ]}
    >
      <Ionicons
        name={yes ? "alert-circle" : "checkmark-circle"}
        size={14}
        color={yes ? "#DC2626" : "#16A34A"}
      />
      <Text style={[styles.ynText, { color: yes ? "#DC2626" : "#16A34A" }]}>
        {yes ? trueLabel : falseLabel}
      </Text>
    </View>
  );
}

function MedRow({ label, value, warn = false }) {
  if (!value) return null;
  return (
    <View style={styles.medRow}>
      <Text style={styles.medRowLabel}>{label}:</Text>
      <Text style={[styles.medRowValue, warn && { color: "#B45309" }]}>
        {value}
      </Text>
    </View>
  );
}

/* ─────────────── main screen ─────────────── */

export default function DiagnosisResultScreen() {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem("diagnosisResult");
        if (raw) setResult(JSON.parse(raw));

        const rawUser = await AsyncStorage.getItem("user");
        if (rawUser) setUser(JSON.parse(rawUser));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleNewAnalysis = async () => {
    await AsyncStorage.removeItem("diagnosisResult");
    router.back();
  };

  const handleSave = async () => {
  if (!result) return;

  setSaving(true);

  try {
    // IMPORTANT:
    // Firestore Security Rules use Firebase Authentication.
    // Do not use only AsyncStorage user data for authentication.
    const firebaseUser = auth.currentUser;

    console.log("Firebase Auth User:", firebaseUser);
    console.log("Firebase UID:", firebaseUser?.uid);

    if (!firebaseUser) {
      Alert.alert(
        "Authentication Required",
        "Your Firebase login session has expired. Please log in again."
      );
      return;
    }

    await addDoc(collection(db, "user_diagnoses"), {
      userId: firebaseUser.uid,
      userEmail: firebaseUser.email || "",
      diagnosis: result,
      createdAt: serverTimestamp(),
    });

    setSaved(true);

    if (Platform.OS === "android") {
      ToastAndroid.show(
        "Diagnosis saved to your profile!",
        ToastAndroid.SHORT
      );
    } else {
      Alert.alert(
        "Saved",
        "Diagnosis saved to your profile successfully!"
      );
    }

  } catch (error) {
    console.error("Error saving to Firestore:", error);

    Alert.alert(
      "Save Failed",
      error?.message || "Failed to save diagnosis."
    );
  } finally {
    setSaving(false);
  }
};


  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={PRIMARY} />
      </SafeAreaView>
    );
  }

  if (!result) {
    return (
      <SafeAreaView style={styles.centered}>
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={52}
          color="#9CA3AF"
        />
        <Text style={styles.emptyText}>No result found.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.circleBtn} onPress={handleNewAnalysis}>
            <Ionicons name="chevron-back" size={22} color="#111" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>AI Diagnosis</Text>

          <TouchableOpacity style={styles.circleBtn} onPress={handleNewAnalysis}>
            <Ionicons name="refresh" size={20} color="#111" />
          </TouchableOpacity>
        </View>

        {/* ══════ HERO CARD ══════ */}
        <View style={styles.heroCard}>
          <View style={styles.heroCardTop}>
            <View style={styles.heroIconWrap}>
              <MaterialCommunityIcons
                name="clipboard-pulse"
                size={28}
                color="#fff"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.heroLabel}>Suspected Condition</Text>
              <Text style={styles.heroDiseaseName}>
                {result.suspectedDisease}
              </Text>
            </View>
          </View>

          <ConfidenceMeter score={result.confidenceScore} />

          <Text style={styles.heroReason}>{result.reasonForSuspicion}</Text>
        </View>

        {/* ══════ DOCTOR / HOSPITAL BADGES ══════ */}
        <View style={styles.badgeRow}>
          <View style={styles.badgeBox}>
            <Text style={styles.badgeBoxLabel}>Visit Doctor?</Text>
            <YesNoBadge
              value={result.shouldVisitDoctor}
              trueLabel="Recommended"
              falseLabel="Not Urgent"
            />
            {!!result.visitDoctorReason && (
              <Text style={styles.badgeBoxNote}>{result.visitDoctorReason}</Text>
            )}
          </View>

          <View style={[styles.badgeBox, { marginLeft: 12 }]}>
            <Text style={styles.badgeBoxLabel}>Hospitalization?</Text>
            <YesNoBadge
              value={result.hospitalizationRecommended}
              trueLabel="Required"
              falseLabel="Not Required"
            />
            {!!result.hospitalizationReason && (
              <Text style={styles.badgeBoxNote}>
                {result.hospitalizationReason}
              </Text>
            )}
          </View>
        </View>

        {/* ══════ WARNING SIGNS (shown early for urgency) ══════ */}
        {result.warningSignsForImmediateAttention?.length > 0 && (
          <View style={styles.warningCard}>
            <View style={styles.warningHeader}>
              <Ionicons name="warning" size={20} color="#DC2626" />
              <Text style={styles.warningTitle}>
                Seek Immediate Attention If…
              </Text>
            </View>
            {result.warningSignsForImmediateAttention.map((w, i) => (
              <BulletItem
                key={i}
                text={w}
                icon="alert-circle"
                iconColor="#DC2626"
              />
            ))}
          </View>
        )}

        {/* ══════ POSSIBLE CAUSES ══════ */}
        {result.possibleCauses?.length > 0 && (
          <SectionCard
            iconName="alert-decagram-outline"
            title="Possible Causes"
          >
            {result.possibleCauses.map((c, i) => (
              <BulletItem key={i} text={c} />
            ))}
          </SectionCard>
        )}

        {/* ══════ COMMON SYMPTOMS ══════ */}
        {result.commonSymptoms?.length > 0 && (
          <SectionCard
            iconName="chart-timeline-variant"
            title="Common Symptoms of This Condition"
          >
            {result.commonSymptoms.map((s, i) => (
              <BulletItem key={i} text={s} />
            ))}
          </SectionCard>
        )}

        {/* ══════ MEDICINES ══════ */}
        {result.medicines?.length > 0 && (
          <SectionCard iconName="pill" title="Suggested Medicines">
            {result.medicines.map((m, i) => (
              <View key={i} style={styles.medicineCard}>
                {/* Medicine Header */}
                <View style={styles.medicineCardHeader}>
                  <View style={styles.medIconWrap}>
                    <MaterialCommunityIcons
                      name="pill"
                      size={18}
                      color={PRIMARY}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.medName}>{m.name}</Text>
                    <Text style={styles.medGeneric}>
                      {m.genericName}
                      {m.category ? ` · ${m.category}` : ""}
                    </Text>
                  </View>
                </View>

                <MedRow label="Purpose"      value={m.purpose} />
                <MedRow label="Dosage"       value={m.dosage} />
                <MedRow label="Precautions"  value={m.precautions} warn />
                <MedRow label="Side Effects" value={m.sideEffects} warn />
              </View>
            ))}
          </SectionCard>
        )}

        {/* ══════ HOME REMEDIES ══════ */}
        {result.homeRemedies?.length > 0 && (
          <SectionCard iconName="home-heart" title="Home Remedies">
            {result.homeRemedies.map((r, i) => (
              <BulletItem key={i} text={r} icon="leaf" iconColor="#16A34A" />
            ))}
          </SectionCard>
        )}

        {/* ══════ FOOD CARDS ══════ */}
        {(result.recommendedFoods?.length > 0 ||
          result.foodsToAvoid?.length > 0) && (
          <View>
            <View style={styles.foodSectionHeader}>
              <View style={styles.sectionIconWrap}>
                <MaterialCommunityIcons
                  name="food-apple-outline"
                  size={18}
                  color={PRIMARY}
                />
              </View>
              <Text style={styles.sectionTitle}>Diet Guidance</Text>
            </View>

            <View style={styles.foodRow}>
              {result.recommendedFoods?.length > 0 && (
                <View style={[styles.foodCard, { marginRight: 6 }]}>
                  <View style={styles.foodCardHeader}>
                    <Ionicons name="nutrition" size={16} color="#16A34A" />
                    <Text style={[styles.foodCardTitle, { color: "#16A34A" }]}>
                      Eat These
                    </Text>
                  </View>
                  {result.recommendedFoods.map((f, i) => (
                    <BulletItem
                      key={i}
                      text={f}
                      icon="checkmark-circle"
                      iconColor="#16A34A"
                    />
                  ))}
                </View>
              )}

              {result.foodsToAvoid?.length > 0 && (
                <View style={[styles.foodCard, { marginLeft: 6 }]}>
                  <View style={styles.foodCardHeader}>
                    <Ionicons name="close-circle" size={16} color="#DC2626" />
                    <Text style={[styles.foodCardTitle, { color: "#DC2626" }]}>
                      Avoid These
                    </Text>
                  </View>
                  {result.foodsToAvoid.map((f, i) => (
                    <BulletItem
                      key={i}
                      text={f}
                      icon="close-circle"
                      iconColor="#DC2626"
                    />
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* ══════ SELF-CARE TIPS ══════ */}
        {result.selfCareTips?.length > 0 && (
          <SectionCard iconName="heart-plus-outline" title="Self-Care Tips">
            {result.selfCareTips.map((t, i) => (
              <BulletItem
                key={i}
                text={t}
                icon="checkmark-circle"
                iconColor={PRIMARY}
              />
            ))}
          </SectionCard>
        )}

        {/* ══════ PREVENTION GUIDE ══════ */}
        {result.preventionGuide?.length > 0 && (
          <SectionCard iconName="shield-check-outline" title="Prevention Guide">
            {result.preventionGuide.map((p, i) => (
              <BulletItem
                key={i}
                text={p}
                icon="shield-checkmark"
                iconColor="#7C3AED"
              />
            ))}
          </SectionCard>
        )}

        {/* ══════ DISCLAIMER ══════ */}
        <View style={styles.disclaimerBox}>
          <Ionicons name="information-circle" size={18} color="#92400E" />
          <Text style={styles.disclaimerText}>{result.disclaimer}</Text>
        </View>

        {/* ══════ BUTTON ROW ══════ */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.btn, styles.saveBtn, (saving || saved) && styles.btnDisabled]}
            onPress={handleSave}
            disabled={saving || saved}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons
                  name={saved ? "checkmark-circle" : "cloud-upload-outline"}
                  size={20}
                  color="#fff"
                />
                <Text style={styles.btnText}>
                  {saved ? "Saved to Profile" : "Save Diagnosis"}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.secondaryBtn]}
            onPress={handleNewAnalysis}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={20} color={PRIMARY} />
            <Text style={[styles.btnText, { color: PRIMARY }]}>New Analysis</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─────────────── Styles ─────────────── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  scrollContent: { padding: 20, paddingBottom: 60 },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "outfitMedium",
    color: "#6B7280",
  },
  backBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: PRIMARY,
    borderRadius: 20,
  },
  backBtnText: {
    color: "#fff",
    fontFamily: "outfitBold",
    fontSize: 15,
  },

  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  circleBtn: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "outfitBold",
    color: "#111827",
  },

  /* Hero card */
  heroCard: {
    backgroundColor: PRIMARY,
    borderRadius: 24,
    padding: 20,
    marginTop: 18,
    elevation: 6,
    shadowColor: PRIMARY,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },
  heroCardTop: { flexDirection: "row", alignItems: "center" },
  heroIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    fontFamily: "outfitMedium",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  heroDiseaseName: {
    fontSize: 22,
    fontFamily: "outfitExtraBold",
    color: "#fff",
    marginTop: 3,
  },
  heroReason: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    fontFamily: "outfitRegular",
    lineHeight: 21,
    marginTop: 14,
  },

  /* Confidence meter */
  confidenceWrap: { marginTop: 16 },
  confidenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  confidenceLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    fontFamily: "outfitMedium",
  },
  confidencePct: { fontSize: 13, fontFamily: "outfitBold" },
  confidenceBar: {
    height: 7,
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 4,
    overflow: "hidden",
  },
  confidenceFill: { height: 7, borderRadius: 4 },

  /* Doctor / Hospital badges */
  badgeRow: { flexDirection: "row", marginTop: 14 },
  badgeBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  badgeBoxLabel: {
    fontSize: 11,
    fontFamily: "outfitSemiBold",
    color: "#9CA3AF",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  ynBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  ynText: { fontSize: 12, fontFamily: "outfitBold", marginLeft: 5 },
  badgeBoxNote: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "outfitRegular",
    marginTop: 8,
    lineHeight: 17,
  },

  /* Warning card */
  warningCard: {
    backgroundColor: "#FEF2F2",
    borderRadius: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#DC2626",
    padding: 16,
    marginTop: 14,
  },
  warningHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  warningTitle: {
    fontSize: 15,
    fontFamily: "outfitBold",
    color: "#DC2626",
    marginLeft: 8,
    flex: 1,
  },

  /* Section card */
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginTop: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#EBF3FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "outfitBold",
    color: "#111827",
  },

  /* Bullet items */
  bulletItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 10,
    flexShrink: 0,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    fontFamily: "outfitRegular",
    lineHeight: 21,
    marginLeft: 8,
  },

  /* Medicine card */
  medicineCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5EDFF",
  },
  medicineCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  medIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EBF3FF",
    justifyContent: "center",
    alignItems: "center",
  },
  medName: {
    fontSize: 15,
    fontFamily: "outfitBold",
    color: "#111827",
  },
  medGeneric: {
    fontSize: 12,
    color: PRIMARY,
    fontFamily: "outfitMedium",
    marginTop: 2,
  },
  medRow: { flexDirection: "row", marginBottom: 5 },
  medRowLabel: {
    fontSize: 13,
    fontFamily: "outfitBold",
    color: "#374151",
    minWidth: 95,
  },
  medRowValue: {
    flex: 1,
    fontSize: 13,
    fontFamily: "outfitRegular",
    color: "#374151",
    lineHeight: 19,
  },

  /* Food section */
  foodSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  foodRow: { flexDirection: "row" },
  foodCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  foodCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  foodCardTitle: {
    fontSize: 14,
    fontFamily: "outfitBold",
    marginLeft: 6,
  },

  /* Disclaimer */
  disclaimerBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF7ED",
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#F97316",
    padding: 14,
    marginTop: 20,
  },
  disclaimerText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: "#92400E",
    fontFamily: "outfitRegular",
    lineHeight: 20,
  },

  /* Button Row styles */
  btnRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  btn: {
    flex: 1,
    height: 58,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  saveBtn: {
    backgroundColor: PRIMARY, // Emerald green for saving
    shadowColor: PRIMARY,
    shadowOpacity: 0.3,
  },
  secondaryBtn: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: PRIMARY,
    elevation: 2,
    shadowColor: PRIMARY,
    shadowOpacity: 0.1,
  },
  btnDisabled: {
    opacity: 0.65,
    backgroundColor: PRIMARY, // Darker green when saved/saving
  },
  btnText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "outfitBold",
  },
});
