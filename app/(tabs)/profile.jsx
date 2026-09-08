import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { db } from "../../configs/FirebaseConfigs";
import {
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";
import { auth } from "../../configs/FirebaseConfigs";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [diagonses, setDiagonses] = useState([]);
    const router = useRouter();


    useEffect(() => {
        const getUser = async () => {
            try {
                // Get Firebase authenticated user
                const firebaseUser = auth.currentUser;

                console.log("Firebase User:", firebaseUser);
                console.log("Firebase UID:", firebaseUser?.uid);

                if (!firebaseUser) {
                    console.log("No Firebase user logged in");
                    router.replace("/");
                    return;
                }

                // Get local user information for displaying name/email
                const data = await AsyncStorage.getItem("user");

                if (data) {
                    const currentUser = JSON.parse(data);
                    setUser(currentUser);
                } else {
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        fullName: firebaseUser.displayName || "",
                    });
                }

                // Get all diagnoses belonging to this Firebase user
                const q = query(
                    collection(db, "user_diagnoses"),
                    where("userId", "==", firebaseUser.uid)
                );

                const result = await getDocs(q);

                const diagnosisList = result.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Sort newest diagnosis first
                diagnosisList.sort((a, b) => {
                    const dateA = a.createdAt?.toDate?.() || new Date(0);
                    const dateB = b.createdAt?.toDate?.() || new Date(0);

                    return dateB - dateA;
                });

                setDiagonses(diagnosisList);

                console.log("Total Diagnoses:", diagnosisList.length);
                console.log("Diagnosis List:", diagnosisList);

            } catch (error) {
                console.error("Error fetching diagnoses:", error);
            }
        };

        getUser();
    }, []);




    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem("user");

                            // Clear local state
                            setUser(null);
                            setDiagonses([]);

                            router.replace("/");
                        } catch (error) {
                            console.log("Logout Error:", error);
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                {/* Profile Card */}
                <View style={styles.profileSection}>
                    <View style={styles.logoWrapper}>
                        <Text style={styles.logo}>
                            {user?.fullName?.charAt(0).toUpperCase() ?? "U"}
                        </Text>
                    </View>

                    <View style={styles.detailsContainer}>
                        <Text style={styles.greetingText}>Hello,</Text>

                        <Text style={styles.nameText}>
                            {user?.fullName ?? "Loading..."}
                        </Text>

                        <Text style={styles.emailText}>
                            {user?.email ?? "Loading..."}
                        </Text>
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons
                        name="logout"
                        size={24}
                        color="#EF4444"
                    />

                    <Text style={styles.logoutText}>
                        Logout
                    </Text>

                    <MaterialCommunityIcons
                        name="chevron-right"
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>

                <View style={styles.recent}>
                    <View style={styles.recentHeader}>
                        <Text style={styles.commonText}>All Diagnoses</Text>
                    </View>

                    {diagonses.length > 0 ? (
                        diagonses.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.diagnosisCard}
                                onPress={() =>
                                    router.push({
                                        pathname: "/CurrentDiagnosisDetails",
                                        params: {
                                            id: item.id.toString(),

                                        },
                                    })
                                }
                            >
                                <View style={styles.iconBox}>
                                    <MaterialCommunityIcons
                                        name="stethoscope"
                                        size={26}
                                        color="#3B82F6"
                                    />
                                </View>

                                <View style={styles.cardContent}>
                                    <Text style={styles.diseaseName}>
                                        {item?.diagnosis?.suspectedDisease || "Unknown Diagnosis"}
                                    </Text>

                                    <Text style={styles.dateText}>
                                        {item?.createdAt?.toDate
                                            ? item.createdAt.toDate().toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })
                                            : "Date unavailable"}
                                    </Text>
                                </View>

                                <MaterialCommunityIcons
                                    name="chevron-right"
                                    size={28}
                                    color="#9CA3AF"
                                />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text
                            style={{
                                textAlign: "center",
                                color: "#6B7280",
                                fontFamily: "outfitRegular",
                                fontSize: 15,
                                marginTop: 20,
                            }}
                        >
                            No diagnoses found.
                        </Text>
                    )}


                </View>

            </ScrollView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    // =========================
    // Recent Diagnoses Section
    // =========================

    recent: {
        marginHorizontal: 20,
        marginTop: 25,
    },

    recentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },

    commonText: {
        fontSize: 24,
        fontFamily: "outfitBold",
        color: "#111827",
    },

    diagnosisCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 16,
        marginBottom: 14,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,

        elevation: 4,
    },

    iconBox: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: "#EEF4FF",
        justifyContent: "center",
        alignItems: "center",
    },

    cardContent: {
        flex: 1,
        marginLeft: 16,
    },

    diseaseName: {
        fontSize: 17,
        color: "#111827",
        fontFamily: "outfitBold",
    },

    dateText: {
        marginTop: 4,
        fontSize: 15,
        color: "#6B7280",
        fontFamily: "outfitRegular",
    },


    icon: {
        marginTop: 10,
    },

    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },

    scrollContainer: {
        paddingBottom: 40,
    },

    profileSection: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        marginHorizontal: 20,
        marginTop: 15,
        padding: 20,
        borderRadius: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 5,
        },
    },

    logoWrapper: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
        backgroundColor: "#3B82F6",
        justifyContent: "center",
        alignItems: "center",
    },

    logo: {
        color: "#fff",
        fontSize: 24,
        fontFamily: "outfitBold",
    },

    detailsContainer: {
        marginLeft: 15,
        flex: 1,
    },

    greetingText: {
        fontSize: 14,
        color: "#64748B",
        fontFamily: "outfitRegular",
    },

    nameText: {
        fontSize: 22,
        color: "#111827",
        fontFamily: "outfitBold",
    },

    emailText: {
        fontSize: 14,
        color: "#64748B",
        fontFamily: "outfitRegular",
    },

    healthCard: {
        backgroundColor: "#3B82F6",
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 22,
        padding: 20,
    },

    stethoscope: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: "#60A5FA",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 18,
    },

    boxText: {
        color: "#fff",
        fontSize: 22,
        fontFamily: "outfitBold",
    },

    boxDescription: {
        color: "#E5E7EB",
        fontSize: 15,
        marginTop: 10,
        lineHeight: 22,
        fontFamily: "outfitMedium",
    },

    common: {
        marginTop: 25,
        marginHorizontal: 20,
    },

    commonHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },

    seeAll: {
        fontSize: 16,
        fontFamily: "outfitSemiBold",
        color: "#3B82F6",
    },

    viewAll: {
        color: "#3B82F6",
        fontSize: 16,
        fontFamily: "outfitSemiBold",
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EF4444",
        marginHorizontal: 20,
        marginTop: 25,
        paddingVertical: 16,
        borderRadius: 18,

        shadowColor: "#EF4444",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,

        elevation: 5,
    },

    logoutText: {
        marginLeft: 12,
        fontSize: 17,
        color: "#FFFFFF",
        fontFamily: "outfitBold",
    },
});

