import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { analyzeSymptoms } from "../../configs/GeminiService";

const PRIMARY = "#3478F6";

export default function DiagnosisScreen() {
  const router = useRouter();
  const [symptom, setSymptom] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!symptom.trim()) {
      Alert.alert("Empty Input", "Please describe your symptoms first.");
      return;
    }
    Keyboard.dismiss();
    setLoading(true);
    try {
      const data = await analyzeSymptoms(symptom.trim());
      // Store result in AsyncStorage then navigate
      await AsyncStorage.setItem("diagnosisResult", JSON.stringify(data));
      router.push("/diagnosisResult");
    } catch (err) {
      console.error(err);
      Alert.alert(
        "Analysis Failed",
        "Could not analyze symptoms. Please check your API key or internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            {/* ── Header ── */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.circleBtn}
                onPress={() => router.back()}
              >
                <Ionicons name="chevron-back" size={22} color="#111" />
              </TouchableOpacity>

              <Text style={styles.headerTitle}>AI Doctor</Text>

              <TouchableOpacity style={styles.circleBtn}>
                <Ionicons name="help-circle-outline" size={22} color="#111" />
              </TouchableOpacity>
            </View>

            {/* ── Title ── */}
            <Text style={styles.title}>Enter Your Symptoms</Text>
            <Text style={styles.subTitle}>
              Tell us what you're feeling and let our AI analyze your symptoms.
            </Text>

            {/* ── Illustration ── */}
            <View style={styles.circleWrapper}>
              <View style={styles.outerCircle}>
                <View style={styles.middleCircle}>
                  <View style={styles.innerCircle}>
                    <MaterialCommunityIcons
                      name="stethoscope"
                      size={60}
                      color="#fff"
                    />
                  </View>
                </View>

                <View style={[styles.smallBtn, { top: 18, right: 20 }]}>
                  <MaterialCommunityIcons
                    name="heart-pulse"
                    size={22}
                    color={PRIMARY}
                  />
                </View>

                <View style={[styles.smallBtn, { top: 95, right: 0 }]}>
                  <Feather name="paperclip" size={20} color={PRIMARY} />
                </View>

                <View style={[styles.smallBtn, { bottom: 20, left: 15 }]}>
                  <Ionicons name="add" size={22} color={PRIMARY} />
                </View>
              </View>
            </View>

            {/* ── Input ── */}
            <Text style={styles.label}>Describe Your Symptoms</Text>
            <View style={styles.inputBox}>
              <TextInput
                placeholder={
                  "Example:\n• Fever for 2 days\n• Severe headache\n• Body aches & chills"
                }
                placeholderTextColor="#999"
                multiline
                value={symptom}
                onChangeText={setSymptom}
                style={styles.input}
                textAlignVertical="top"
                scrollEnabled={false}
                editable={!loading}
              />
            </View>

            {/* ── Quick Symptom Tags ── */}
            <Text style={styles.quickLabel}>Quick Add</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.tagsScroll}
              contentContainerStyle={styles.tagsContainer}
            >
              {[
                "Fever",
                "Headache",
                "Cough",
                "Fatigue",
                "Nausea",
                "Sore throat",
                "Body aches",
                "Dizziness",
                "Chest pain",
                "Shortness of breath",
              ].map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={styles.tag}
                  onPress={() =>
                    setSymptom((prev) =>
                      prev ? `${prev}\n• ${tag}` : `• ${tag}`
                    )
                  }
                >
                  <Text style={styles.tagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* ── Analyze Button ── */}
            <TouchableOpacity
              style={[styles.analyzeBtn, loading && styles.analyzeBtnDisabled]}
              onPress={handleAnalyze}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.analyzeBtnText}>Analyzing…</Text>
                </>
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="creation"
                    size={22}
                    color="#fff"
                  />
                  <Text style={styles.analyzeBtnText}>Analyze Symptoms</Text>
                </>
              )}
            </TouchableOpacity>

            {/* ── Loading Steps (shown while waiting) ── */}
            {loading && (
              <View style={styles.loadingSteps}>
                {[
                  "Identifying possible conditions…",
                  "Reviewing medicines & dosages…",
                  "Preparing personalized guidance…",
                ].map((s, i) => (
                  <View key={i} style={styles.loadingStep}>
                    <ActivityIndicator
                      size="small"
                      color={PRIMARY}
                      style={{ marginRight: 10 }}
                    />
                    <Text style={styles.loadingStepText}>{s}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* ── Footer Note ── */}
            {!loading && (
              <View style={styles.footerNote}>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color="#777"
                />
                <Text style={styles.footerNoteText}>
                  Our AI provides educational health guidance only. Always
                  consult a qualified doctor before taking any medication.
                </Text>
              </View>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  scrollContent: { padding: 20, paddingBottom: 50 },

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

  /* Title */
  title: {
    fontSize: 32,
    fontFamily: "outfitExtraBold",
    color: "#111827",
    marginTop: 28,
    lineHeight: 40,
  },
  subTitle: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 10,
    lineHeight: 23,
    fontFamily: "outfitRegular",
  },

  /* Illustration */
  circleWrapper: { alignItems: "center", marginVertical: 32 },
  outerCircle: {
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "#E8F1FF",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  middleCircle: {
    width: 155,
    height: 155,
    borderRadius: 78,
    backgroundColor: "#D5E4FF",
    justifyContent: "center",
    alignItems: "center",
  },
  innerCircle: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: PRIMARY,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  smallBtn: {
    position: "absolute",
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  /* Input */
  label: {
    fontSize: 17,
    fontFamily: "outfitBold",
    color: "#111827",
    marginBottom: 10,
  },
  inputBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#BFD5FF",
    padding: 16,
    minHeight: 130,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  input: {
    fontSize: 15,
    color: "#111827",
    fontFamily: "outfitRegular",
    textAlignVertical: "top",
    minHeight: 100,
  },

  /* Quick tags */
  quickLabel: {
    fontSize: 14,
    fontFamily: "outfitSemiBold",
    color: "#6B7280",
    marginTop: 16,
    marginBottom: 10,
  },
  tagsScroll: { marginHorizontal: -20 },
  tagsContainer: { paddingHorizontal: 20, gap: 8 },
  tag: {
    backgroundColor: "#EBF3FF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#BFD5FF",
  },
  tagText: {
    fontSize: 13,
    fontFamily: "outfitMedium",
    color: PRIMARY,
  },

  /* Analyze button */
  analyzeBtn: {
    height: 58,
    backgroundColor: PRIMARY,
    borderRadius: 30,
    marginTop: 24,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    elevation: 5,
    shadowColor: PRIMARY,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  analyzeBtnDisabled: { opacity: 0.75 },
  analyzeBtnText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "outfitBold",
  },

  /* Loading steps */
  loadingSteps: { marginTop: 20, gap: 10 },
  loadingStep: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  loadingStepText: {
    fontSize: 14,
    fontFamily: "outfitMedium",
    color: "#374151",
  },

  /* Footer note */
  footerNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 22,
    paddingHorizontal: 4,
  },
  footerNoteText: {
    flex: 1,
    marginLeft: 8,
    color: "#9CA3AF",
    fontSize: 13,
    lineHeight: 19,
    fontFamily: "outfitRegular",
  },
});