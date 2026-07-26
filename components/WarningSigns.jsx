import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { fetchDiagnosis } from "../app/services/fetchDiagnosis";
import { useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function WarningSigns() {
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

  return (
  <View style={styles.card}>
    {/* Header */}
    <View style={styles.header}>
      <MaterialCommunityIcons
        name="alert-circle"
        size={28}
        color="#DC2626"
      />

      <Text style={styles.heading}>
        Warning Signs
      </Text>
    </View>

    {/* Warning Signs */}
    {diagnosisDetails?.diagnosis?.warningSignsForImmediateAttention?.map(
      (warning, index) => (
        <View key={index} style={styles.warningCard}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="alert"
              size={24}
              color="#DC2626"
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.warningText}>
              {warning}
            </Text>
            <Text style={styles.subtitle}>
              Seek immediate medical attention if this occurs.
            </Text>
          </View>

          
        </View>
      )
    )}
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

  heading: {
    fontSize: 22,
    fontFamily: "outfitBold",
    color: "black",
    marginLeft: 5,
  },

  warningCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
  },

  warningText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "outfitMedium",
    color: "#7F1D1D",
    width: 250,
  },
  header: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 20,
},

iconContainer: {
  width: 52,
  height: 52,
  borderRadius: 26,
  backgroundColor: "#FEE2E2",
  justifyContent: "center",
  alignItems: "center",
},

textContainer: {
  flex: 1,
  marginLeft: 14,
  marginRight: 10,
},

subtitle: {
  marginTop: 4,
  fontSize: 13,
  fontFamily: "outfitRegular",
  color: "#7f7f7f",
  width: 200,
},
});