import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { fetchDiagnosis } from "../app/services/fetchDiagnosis";

export default function HomeRemedies() {
  const { id } = useLocalSearchParams();

  const [diagnosisDetails, setDiagnosisDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDiagnosis(id);

        if (data) {
          setDiagnosisDetails(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  const homeRemides = [
    "tea",
    "cup-water",
    "face-man-shimmer",
    "shaker",
  ];

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="home"
          size={26}
          color="#1645a3"
        />

        <Text style={styles.heading}>
          Home Remedis
        </Text>
      </View>

      {/* Food List */}
      {diagnosisDetails?.diagnosis?.homeRemedies?.map((food, index) => (
        <View key={index} style={styles.foodCard}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={homeRemides[index] || "food-apple"}
              size={24}
              color="#1645a3"
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.foodName}>
              {food}
            </Text>

            <Text style={styles.subtitle}>
              Good for recovery and immunity
            </Text>
          </View>

          <MaterialCommunityIcons
            name="check-circle"
            size={24}
            color="#1645a3"
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

  foodCard: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#F8FAFF",

    borderRadius: 16,

    paddingVertical: 14,
    paddingHorizontal: 14,

    marginBottom: 14,

    borderWidth: 1,
    borderColor: "#d1deff",
  },

  iconContainer: {
    width: 48,
    height: 48,

    borderRadius: 24,

    backgroundColor: "#bcd4ff",

    justifyContent: "center",
    alignItems: "center",
  },

  textContainer: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },

  foodName: {
    fontSize: 16,
    fontFamily: "outfitBold",
    color: "#111827",
    lineHeight: 22,
  },

  subtitle: {
    marginTop: 3,
    fontSize: 13,
    fontFamily: "outfitRegular",
    color: "#6B7280",
  },
});