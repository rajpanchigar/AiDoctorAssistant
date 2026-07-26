import { View, Text } from 'react-native'
import React from 'react'
import { fetchDiagnosis } from '../app/services/fetchDiagnosis'
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView } from 'react-native';
export default function Medicines() {
    const { id } = useLocalSearchParams();
    const [diagnosisDetails, setDiagnosisDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const LoadData = async () => {
            console.log("ID:", id);

            const data = await fetchDiagnosis(id);

            console.log("Fetched Data:", data);

            if (data) {
                setDiagnosisDetails(data);
            }

            setLoading(false);
        };

        if (id) {
            LoadData();
        }
    }, [id]);

    console.log("diagnosis", diagnosisDetails);
    console.log("id", id);


    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >

            {/* Header */}

            <View style={styles.header}>
                <MaterialCommunityIcons
                    name="pill"
                    size={30}
                    color="#FFFFFF"
                />

                <View style={styles.headerText}>
                    <Text style={styles.headerTitle}>
                        Medicines
                    </Text>

                    <Text style={styles.headerSubtitle}>
                        Recommended medicines for your condition
                    </Text>
                </View>
            </View>

            {diagnosisDetails?.diagnosis?.medicines?.length > 0 ? (

                diagnosisDetails.diagnosis.medicines.map((medicine, index) => (

                    <View
                        key={index}
                        style={styles.medicineCard}
                    >

                        {/* Medicine Top */}

                        <View style={styles.medicineHeader}>

                            <View style={styles.iconCircle}>
                                <MaterialCommunityIcons
                                    name="pill"
                                    size={24}
                                    color="#2563EB"
                                />
                            </View>

                            <View style={{ flex: 1 }}>

                                <Text style={styles.medicineName}>
                                    {medicine.name}
                                </Text>

                                <Text style={styles.categoryBadge}>
                                    {medicine.category}
                                </Text>

                            </View>

                        </View>

                        {/* Generic Name */}

                        <View style={styles.infoItem}>
                            <MaterialCommunityIcons
                                name="medical-bag"
                                size={22}
                                color="#2563EB"
                            />

                            <View style={styles.infoContent}>
                                <Text style={styles.infoTitle}>
                                    Generic Name
                                </Text>

                                <Text style={styles.infoValue}>
                                    {medicine.genericName}
                                </Text>
                            </View>
                        </View>

                        {/* Dosage */}

                        <View style={styles.infoItem}>
                            <MaterialCommunityIcons
                                name="clock-outline"
                                size={22}
                                color="#10B981"
                            />

                            <View style={styles.infoContent}>
                                <Text style={styles.infoTitle}>
                                    Dosage
                                </Text>

                                <Text style={styles.infoValue}>
                                    {medicine.dosage}
                                </Text>
                            </View>
                        </View>

                        {/* Purpose */}

                        <View style={styles.infoItem}>
                            <MaterialCommunityIcons
                                name="target"
                                size={22}
                                color="#8B5CF6"
                            />

                            <View style={styles.infoContent}>
                                <Text style={styles.infoTitle}>
                                    Purpose
                                </Text>

                                <Text style={styles.infoValue}>
                                    {medicine.purpose}
                                </Text>
                            </View>
                        </View>

                        {/* Precautions */}

                        <View style={styles.infoItem}>
                            <MaterialCommunityIcons
                                name="shield-check-outline"
                                size={22}
                                color="#F59E0B"
                            />

                            <View style={styles.infoContent}>
                                <Text style={styles.infoTitle}>
                                    Precautions
                                </Text>

                                <Text style={styles.infoValue}>
                                    {medicine.precautions}
                                </Text>
                            </View>
                        </View>

                        {/* Side Effects */}

                        <View style={styles.infoItem}>
                            <MaterialCommunityIcons
                                name="alert-circle-outline"
                                size={22}
                                color="#EF4444"
                            />

                            <View style={styles.infoContent}>
                                <Text style={styles.infoTitle}>
                                    Side Effects
                                </Text>

                                <Text style={styles.infoValue}>
                                    {medicine.sideEffects}
                                </Text>
                            </View>
                        </View>

                    </View>

                ))

            ) : (

                <View style={styles.emptyContainer}>

                    <MaterialCommunityIcons
                        name="pill-off"
                        size={60}
                        color="#94A3B8"
                    />

                    <Text style={styles.emptyTitle}>
                        No Medicines Available
                    </Text>

                    <Text style={styles.emptySubtitle}>
                        No medicine recommendations were found for this diagnosis.
                    </Text>

                </View>

            )}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8FC",
  },

  contentContainer: {
    padding: 16,
    paddingBottom: 30,
  },

  /* Loading */

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F8FC",
  },

  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#2563EB",
    fontFamily: "outfitMedium",
  },

  /* Header */

  header: {
    backgroundColor: "#2563EB",
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,

    shadowColor: "#2563EB",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 8,
  },

  headerText: {
    marginLeft: 14,
    flex: 1,
  },

  headerTitle: {
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: "outfitBold",
  },

  headerSubtitle: {
    marginTop: 5,
    fontSize: 14,
    color: "#DCEBFF",
    fontFamily: "outfitRegular",
    lineHeight: 20,
  },

  /* Medicine Card */

  medicineCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 5,
  },

  /* Top */

  medicineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EEF5FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  medicineName: {
    fontSize: 20,
    color: "#111827",
    fontFamily: "outfitBold",
  },

  categoryBadge: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "#DBEAFE",
    color: "#2563EB",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    overflow: "hidden",
    fontSize: 13,
    fontFamily: "outfitMedium",
  },

  /* Information */

  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },

  infoContent: {
    flex: 1,
    marginLeft: 12,
  },

  infoTitle: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 3,
    fontFamily: "outfitMedium",
  },

  infoValue: {
    fontSize: 16,
    color: "#111827",
    lineHeight: 24,
    fontFamily: "outfitRegular",
  },

  /* Empty State */

  emptyContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 5,
  },

  emptyTitle: {
    marginTop: 18,
    fontSize: 20,
    color: "#1F2937",
    fontFamily: "outfitBold",
  },

  emptySubtitle: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 24,
    fontFamily: "outfitRegular",
  },
});