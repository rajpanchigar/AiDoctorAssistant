import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";

import {
  Stethoscope,
  ShieldCheck,
  Sparkles,
  HeartPulse,
  Pill,
  MessageCircleMore,
  CheckCircle2,
  Lock,
  ArrowRight,
} from "lucide-react-native";

import { useRouter } from "expo-router";
export default function Index() {

    const router = useRouter();


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Stethoscope size={24} color="#2B7FFF" />
          </View>

          <View style={styles.badge}>
            <ShieldCheck size={16} color="#2B7FFF" />
            <Text style={styles.badgeText}>Trusted AI Care</Text>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <View style={styles.blurCircleLarge} />
          <View style={styles.blurCircleSmall} />

          <View style={styles.heroIcon}>
            <Stethoscope size={52} color="#FFFFFF" />
          </View>

          <Text style={styles.title}>AI Doctor Assistant</Text>

          <Text style={styles.subtitle}>
            Get instant symptom guidance, medicine suggestions, and a smoother
            path to better health.
          </Text>
        </View>

        {/* Main Feature Card */}
        <View style={styles.featureCard}>
          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Sparkles size={22} color="#2B7FFF" />
            </View>

            <View>
              <Text style={styles.featureTitle}>
                Smart Symptom Analysis
              </Text>

              <Text style={styles.featureSubtitle}>
                Describe how you feel in seconds
              </Text>
            </View>
          </View>

          <View style={styles.quickFeatures}>
            <View style={styles.quickCard}>
              <HeartPulse size={22} color="#2B7FFF" />
              <Text style={styles.quickText}>Fast</Text>
            </View>

            <View style={styles.quickCard}>
              <Pill size={22} color="#2B7FFF" />
              <Text style={styles.quickText}>Medicine</Text>
            </View>

            <View style={styles.quickCard}>
              <MessageCircleMore size={22} color="#2B7FFF" />
              <Text style={styles.quickText}>Guidance</Text>
            </View>
          </View>
        </View>

        {/* Recommendation Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <CheckCircle2 size={22} color="#2B7FFF" />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              Personalized Recommendations
            </Text>

            <Text style={styles.infoDescription}>
              Receive appropriate medicine suggestions based on your symptoms.
            </Text>
          </View>
        </View>

        {/* Security Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Lock size={22} color="#2B7FFF" />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              Private and Secure
            </Text>

            <Text style={styles.infoDescription}>
              Your health details stay protected and easy to access.
            </Text>
          </View>
        </View>

        {/* Get Started */}
        <TouchableOpacity style={styles.button} onPress={()=> router.push('/auth/signIn')}>
          <Text style={styles.buttonText}>Get Started</Text>

          <ArrowRight size={20} color="#FFF" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F4F4F5",
    justifyContent: "center",
    alignItems: "center",
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E4E4E7",
  },

  badgeText: {
    marginLeft: 6,
    color: "#71717A",
    fontSize: 12,
    fontFamily:"outfitBold"
  },

  heroContainer: {
    alignItems: "center",
    marginTop: 25,
    marginBottom: 20,
  },

  blurCircleLarge: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(43,127,255,0.08)",
    top: -20,
  },

  blurCircleSmall: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(43,127,255,0.12)",
    top: 0,
  },

  heroIcon: {
    width: 120,
    height: 120,
    borderRadius: 32,
    backgroundColor: "#2B7FFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },

  title: {
    fontSize: 34,
    color: "#09090B",
    marginTop: 18,
    textAlign: "center",
    fontFamily:"outfitBold"
  },

  subtitle: {
    fontSize: 15,
    color: "#71717A",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 24,
    paddingHorizontal: 12,
    fontFamily:"outfitBold"
  },

  featureCard: {
    backgroundColor: "#FFF",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    padding: 18,
    marginTop: 15,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#F4F4F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  featureTitle: {
    fontSize: 15,
    color: "#09090B",
    fontFamily:"outfitBold"
  },

  featureSubtitle: {
    fontSize: 13,
    color: "#71717A",
    marginTop: 2,
    fontFamily:"outfitMedium"
  },

  quickFeatures: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  quickCard: {
    flex: 1,
    backgroundColor: "#F4F4F5",
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 16,
    marginHorizontal: 4,
  },

  quickText: {
    marginTop: 8,
    fontSize: 12,
    color: "#09090B",
    fontFamily:"outfitRegular"
  },

  infoCard: {
    flexDirection: "row",
    backgroundColor: "#F4F4F5",
    borderRadius: 24,
    padding: 15,
    marginTop: 15,
  },

  infoIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 15,
    color: "#09090B",
    fontFamily:"outfitBold"
  },

  infoDescription: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 20,
    color: "#71717A",
    fontFamily:"outfitRegular"
  },

  button: {
    marginTop: 25,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#2B7FFF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
        
  },

  buttonText: {
    color: "#FFF",
    fontSize: 17,
    marginRight: 8,
    fontFamily:"outfitBold"
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },

  footerText: {
    color: "#71717A",
    fontFamily:"outfitMedium"
  },

  signIn: {
    color: "#2B7FFF",
    marginLeft: 5,
    fontFamily:"outfitMedium"
  },
});