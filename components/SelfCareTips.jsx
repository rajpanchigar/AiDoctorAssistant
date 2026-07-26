import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { fetchDiagnosis } from "../app/services/fetchDiagnosis";
import { useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SelfCareTips() {
  const { id } = useLocalSearchParams();

  const [diagnosisDetails, setDiagnosisDetails] = useState();

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

  const selfCareIcons = [
    "bed",
    "fan",
    "cup-water",
    "food-apple",
    "walk",
    "hand-wash",
    "pill",
    "weather-sunny",
    "meditation",
    "heart-pulse",
  ];

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="heart-pulse"
          size={28}
          color="#0F766E"
        />

        <Text style={styles.heading}>Self Care Tips</Text>
      </View>

      {/* Self Care Tips */}
      {diagnosisDetails?.diagnosis?.selfCareTips?.map((tip, index) => (
        <View key={index} style={styles.tipCard}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={selfCareIcons[index] || "hand-heart"}
              size={24}
              color="#0F766E"
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.tipText}>{tip}</Text>

            <Text style={styles.subtitle}>
              Follow this tip for a faster recovery.
            </Text>
          </View>

          <MaterialCommunityIcons
            name="check-circle"
            size={24}
            color="#14B8A6"
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 20,
    borderRadius: 24,
    padding: 20,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 5,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  heading: {
    fontSize: 22,
    fontFamily: "outfitBold",
    color: "#000",
    marginLeft: 10,
  },

  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
  },

  textContainer: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },

  tipText: {
    fontSize: 16,
    fontFamily: "outfitBold",
    color: "#000",
    lineHeight: 22,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    fontFamily: "outfitRegular",
    color: "#64748B",
  },
});
