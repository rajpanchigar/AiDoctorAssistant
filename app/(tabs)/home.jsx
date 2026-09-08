import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CommonHealthTips from "../../components/CommonHealthTips";
import { db } from "../../configs/FirebaseConfigs";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState(null);
  const [diagonses, setDiagonses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await AsyncStorage.getItem("user");

        if (data) {
          const currentUser = JSON.parse(data);
          setUser(currentUser);

          const q = query(
            collection(db, "user_diagnoses"),
            where("userId", "==", currentUser.uid)
          );

          const result = await getDocs(q);
          const diagnosisList = [];

          result.forEach((doc) => {
            diagnosisList.push({
              id: doc.id,
              ...doc.data(),
            });
          });

          setDiagonses(diagnosisList);
        } else {
          router.replace("/");
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, []);

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
            <Text style={styles.nameText}>{user?.fullName ?? "Loading..."}</Text>
            <Text style={styles.emailText}>{user?.email ?? "Loading..."}</Text>
          </View>
        </View>

        {/* AI Card */}
        <View style={styles.healthCard}>
          <View style={styles.stethoscope}>
            <MaterialCommunityIcons name="stethoscope" size={22} color="#fff" />
          </View>

          <Text style={styles.boxText}>Describe How You Feel Today ??</Text>

          <Text style={styles.boxDescription}>
            Enter your symptoms and get AI-powered guidance instantly.
          </Text>
        </View>

        {/* Health Tips */}
        <View style={styles.common}>
          <View style={styles.commonHeader}>
            <Text style={styles.commonText}>Common Health Tips</Text>
            <TouchableOpacity onPress={() => router.push("/AllCommonHealthTips")}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <CommonHealthTips />
        </View>

        {/* Recent Diagnoses */}
        <View style={styles.recent}>
          <View style={styles.recentHeader}>
            <Text style={styles.commonText}>Recent Diagnoses</Text>
            <TouchableOpacity onPress={() => router.push("/profile")}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {diagonses.slice(0, 2).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.diagnosisCard}
              onPress={() =>
                router.push({
                  pathname: "/CurrentDiagnosisDetails",
                  params: { id: item.id },
                })
              }
            >
              <View style={styles.iconBox}>
                <MaterialCommunityIcons name="stethoscope" size={26} color="#3B82F6" />
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.diseaseName}>
                  {item?.diagnosis?.diagnosisTitle}
                </Text>
                <Text style={styles.dateText}>
                  {item.createdAt?.toDate().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </View>

              <MaterialCommunityIcons name="chevron-right" size={28} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Reusable platform-specific shadow generator
const cardShadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  android: {
    elevation: 5,
  },
  default: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
});

const smallCardShadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  android: {
    elevation: 4,
  },
  default: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
});

const styles = StyleSheet.create({
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
    ...cardShadow,
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

  commonText: {
    fontSize: 24,
    fontFamily: "outfitBold",
    color: "#111827",
  },

  seeAll: {
    fontSize: 16,
    fontFamily: "outfitSemiBold",
    color: "#3B82F6",
  },

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

  viewAll: {
    color: "#3B82F6",
    fontSize: 16,
    fontFamily: "outfitSemiBold",
  },

  diagnosisCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    ...smallCardShadow,
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
});