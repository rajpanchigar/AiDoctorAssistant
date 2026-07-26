import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { fetchDiagnosis } from "./services/fetchDiagnosis";
import Medicines from "../components/Medicines";
import CommonSymptoms from "../components/CommonSymptoms";
import FoodToAvoids from "../components/FoodToAvoids";
import RecommandedFoods from "../components/RecommandedFoods";
import HomeRemedies from "../components/HomeRemedies";
import SelfCareTips from "../components/SelfCareTips";
import WarningSigns from "../components/WarningSigns";
export default function CurrentDiagnosisDetails() {
    const { id } = useLocalSearchParams();
    const [diagnosisDetails, setDiagnosisDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const LoadData = async () => {
            const data = await fetchDiagnosis(id);

            if (data) {
                setDiagnosisDetails(data);
            }

            setLoading(false);
        };

        if (id) {
            LoadData();
        }
    }, [id]);

    if (loading) {
        return (
            <SafeAreaView style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#2B7FFF" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.iconCircle}>
                        <MaterialCommunityIcons
                            name="stethoscope"
                            size={45}
                            color="#2B7FFF"
                        />
                    </View>

                    <Text style={styles.title}>
                        {diagnosisDetails?.diagnosis?.diagnosisTitle}
                    </Text>

                    <Text style={styles.subtitle}>
                        AI Health Analysis Report
                    </Text> 
                </View>

                {/* Disclaimer */}
                <View style={styles.card}>
                    <View style={styles.row}>
                        <MaterialCommunityIcons
                            name="information-outline"
                            size={24}
                            color="#2B7FFF"
                        />
                        <Text style={styles.cardTitle}>Disclaimer</Text>
                    </View>

                    <Text style={styles.cardText}>
                        {diagnosisDetails?.diagnosis?.disclaimer}
                    </Text>
                </View>

                {/* Possible Causes */}
                {diagnosisDetails?.diagnosis?.possibleCauses && (
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <MaterialCommunityIcons
                                name="alert-circle-outline"
                                size={24}
                                color="#FF9800"
                            />
                            <Text style={styles.cardTitle}>Possible Causes</Text>
                        </View>

                        <Text style={styles.cardText}>
                            {diagnosisDetails?.diagnosis?.possibleCauses}
                        </Text>
                    </View>
                )}

                {/* CommonSymptoms */}
                <CommonSymptoms/>
                {/* WarningSigns */}
                <WarningSigns/>
                {/* Medicine */}
                <Medicines/>
                {/* Foods To Avoids */}
                <FoodToAvoids/>
                {/* Recommanded Foods */}
                <RecommandedFoods/>
                {/* Home Remedies */}
                <HomeRemedies/>
                {/* Self Care Tips */ }
                <SelfCareTips/>


            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    description: {
        width: 250,
        flexDirection: "column",
        marginTop: 30,
        right: 170,
        fontFamily: "outfitRegular",
        marginBottom: 5,
    },
    symptomsContainer: {
        flexDirection: "row",
        marginLeft: 30,
        marginTop: 10,
    },
    medicineContainer: {
        flexDirection: "row",
        marginLeft: 30,
        marginTop: 10,
    },
    medicine: {
        marginLeft: 10,
        fontSize: 20,
        fontFamily: "outfitBold",
        marginTop: 2,
    },

    symptoms: {
        marginLeft: 10,
        fontSize: 17,
        fontFamily: "outfitMedium",
        marginTop: 2,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F7FB",
    },

    mainContainer: {
        flex: 1,
        backgroundColor: "#F5F7FB",
    },

    header: {
        backgroundColor: "#2B7FFF",
        margin: 20,
        borderRadius: 28,
        paddingVertical: 30,
        alignItems: "center",

        shadowColor: "#2B7FFF",
        shadowOpacity: 0.25,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 5,
        },

        elevation: 8,
    },

    iconCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 18,
    },

    title: {
        color: "#FFFFFF",
        fontSize: 28,
        fontFamily: "outfitBold",
        textAlign: "center",
        paddingHorizontal: 20,
    },

    subtitle: {
        color: "#DDEAFF",
        marginTop: 8,
        fontSize: 16,
        fontFamily: "outfitRegular",
    },

    card: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 20,
        marginBottom: 18,
        borderRadius: 20,
        padding: 20,

        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 5,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },

    cardTitle: {
        fontSize: 22,
        fontFamily: "outfitBold",
        marginLeft: 10,
        color: "#111827",
    },

    cardText: {
        fontSize: 16,
        lineHeight: 26,
        color: "#4B5563",
        fontFamily: "outfitRegular",
        textAlign: "justify",
    },

    commonSymptomsText: {
        fontSize: 16,
        lineHeight: 26,
        color: "#4B5563",
        fontFamily: "outfitRegular",
        textAlign: "justify",
        left: 30,
        marginLeft: 4,
    },

    emergencyCard: {
        backgroundColor: "#EF4444",
        marginHorizontal: 20,
        marginBottom: 25,
        borderRadius: 20,
        padding: 20,

        shadowColor: "#EF4444",
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 6,
    },

    emergencyTitle: {
        color: "#FFFFFF",
        fontSize: 20,
        fontFamily: "outfitBold",
        marginLeft: 10,
    },

    emergencyText: {
        color: "#FFFFFF",
        fontSize: 16,
        lineHeight: 26,
        fontFamily: "outfitRegular",
        textAlign: "justify",
    },
});