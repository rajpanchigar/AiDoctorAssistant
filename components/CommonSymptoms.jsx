import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { fetchDiagnosis } from "../app/services/fetchDiagnosis";

export default function CommonSymptoms() {
  const { id } = useLocalSearchParams();

  const [diagnosisDetails, setDiagnosisDetails] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchDiagnosis(id);

      if (data) {
        setDiagnosisDetails(data);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  const symptomIcons = [
    "thermometer",
    "head-outline",
    "lungs",
    "weather-windy",
    "arm-flex-outline",
    "emoticon-sick-outline",
    "heart-pulse",
    "medical-bag",
  ];

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="stethoscope"
          size={26}
          color="#F97316"
        />

        <Text style={styles.heading}>
          Common Symptoms
        </Text>
      </View>

      {/* Symptoms List */}
      {diagnosisDetails?.diagnosis?.commonSymptoms?.map((symptom, index) => (
        <View key={index} style={styles.symptomCard}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={symptomIcons[index] || "medical-bag"}
              size={24}
              color="#F97316"
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.symptomName}>
              {symptom}
            </Text>

            <Text style={styles.subtitle}>
              Common symptom of this condition
            </Text>
          </View>

          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={22}
            color="#F97316"
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 20,
    borderRadius: 22,
    padding: 20,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  heading: {
    fontSize: 22,
    fontFamily: "outfitBold",
    color: "#111827",
    marginLeft: 10,
  },

  symptomCard: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFF7ED",

    borderRadius: 16,

    paddingVertical: 14,
    paddingHorizontal: 14,

    marginBottom: 14,

    borderWidth: 1,
    borderColor: "#FED7AA",
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,

    backgroundColor: "#FFEDD5",

    justifyContent: "center",
    alignItems: "center",
  },

  textContainer: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },

  symptomName: {
    fontSize: 16,
    fontFamily: "outfitBold",
    color: "#111827",
    lineHeight: 22,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    fontFamily: "outfitRegular",
    color: "#6B7280",
    lineHeight: 18,
  },
});