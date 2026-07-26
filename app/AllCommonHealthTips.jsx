import React from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const tips = [
  {
    id: "1",
    title: "Stay Hydrated",
    description: "Drink at least 8 glasses of water every day.",
    icon: "water-outline",
  },
  {
    id: "2",
    title: "Sleep Well",
    description: "Aim for 7–8 hours of quality sleep every night.",
    icon: "moon-outline",
  },
  {
    id: "3",
    title: "Exercise Daily",
    description: "Walk, jog, or exercise for at least 30 minutes.",
    icon: "walk-outline",
  },
  {
    id: "4",
    title: "Healthy Diet",
    description: "Eat more fruits, vegetables, and whole grains.",
    icon: "nutrition-outline",
  },
  {
    id: "5",
    title: "Wash Hands",
    description: "Wash your hands regularly with soap and water.",
    icon: "hand-left-outline",
  },
  {
    id: "6",
    title: "Brush Teeth",
    description: "Brush twice daily and floss regularly.",
    icon: "happy-outline",
  },
  {
    id: "7",
    title: "Reduce Sugar",
    description: "Limit sugary drinks and processed sweets.",
    icon: "cafe-outline",
  },
  {
    id: "8",
    title: "Eat Protein",
    description: "Include lean protein in every meal.",
    icon: "restaurant-outline",
  },
  {
    id: "9",
    title: "Protect Your Eyes",
    description: "Follow the 20-20-20 rule while using screens.",
    icon: "eye-outline",
  },
  {
    id: "10",
    title: "Take Breaks",
    description: "Stand up and stretch every hour.",
    icon: "body-outline",
  },
  {
    id: "11",
    title: "Deep Breathing",
    description: "Practice deep breathing to reduce stress.",
    icon: "leaf-outline",
  },
  {
    id: "12",
    title: "Meditate",
    description: "Spend 10 minutes meditating every day.",
    icon: "flower-outline",
  },
  {
    id: "13",
    title: "Limit Salt",
    description: "Reduce sodium intake for better heart health.",
    icon: "restaurant-outline",
  },
  {
    id: "14",
    title: "Eat Fruits",
    description: "Have at least one fresh fruit daily.",
    icon: "nutrition-outline",
  },
  {
    id: "15",
    title: "Avoid Smoking",
    description: "Smoking harms your lungs and heart.",
    icon: "ban-outline",
  },
  {
    id: "16",
    title: "Limit Alcohol",
    description: "Drink alcohol only in moderation.",
    icon: "wine-outline",
  },
  {
    id: "17",
    title: "Wear Sunscreen",
    description: "Protect your skin from harmful UV rays.",
    icon: "sunny-outline",
  },
  {
    id: "18",
    title: "Stay Active",
    description: "Avoid sitting for long periods.",
    icon: "fitness-outline",
  },
  {
    id: "19",
    title: "Healthy Weight",
    description: "Maintain a healthy body weight through diet and exercise.",
    icon: "barbell-outline",
  },
  {
    id: "20",
    title: "Regular Checkups",
    description: "Visit your doctor for routine health screenings.",
    icon: "medical-outline",
  },
  {
    id: "21",
    title: "Good Posture",
    description: "Sit and stand with proper posture.",
    icon: "accessibility-outline",
  },
  {
    id: "22",
    title: "Stay Positive",
    description: "Maintain a positive attitude every day.",
    icon: "happy-outline",
  },
  {
    id: "23",
    title: "Manage Stress",
    description: "Take time to relax and enjoy hobbies.",
    icon: "heart-outline",
  },
  {
    id: "24",
    title: "Drink Milk",
    description: "Consume calcium-rich foods for stronger bones.",
    icon: "water-outline",
  },
  {
    id: "25",
    title: "Eat Fiber",
    description: "Choose whole grains, beans, and vegetables.",
    icon: "leaf-outline",
  },
  {
    id: "26",
    title: "Stay Clean",
    description: "Maintain good personal hygiene every day.",
    icon: "sparkles-outline",
  },
  {
    id: "27",
    title: "Vaccinations",
    description: "Keep your vaccinations up to date.",
    icon: "shield-checkmark-outline",
  },
  {
    id: "28",
    title: "Heart Health",
    description: "Choose healthy fats and exercise regularly.",
    icon: "heart-circle-outline",
  },
  {
    id: "29",
    title: "Hydrate After Exercise",
    description: "Replace lost fluids after physical activity.",
    icon: "water-outline",
  },
  {
    id: "30",
    title: "Listen to Your Body",
    description: "Seek medical advice if symptoms persist.",
    icon: "medkit-outline",
  },
];

const TipCard = React.memo(({ item }) => (
  <View style={styles.card}>
    <View style={styles.iconContainer}>
      <Ionicons
        name={item.icon}
        size={26}
        color="#3B82F6"
      />
    </View>

    <View style={styles.content}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>
    </View>
  </View>
));
TipCard.displayName = "TipCard";

const renderItem = ({ item }) => <TipCard item={item} />;

export default function AllCommonHealthTips() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Common Health Tips</Text>

      <FlatList
        data={tips}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={renderItem}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  heading: {
    fontSize: 28,
    fontFamily: "outfitBold",
    color: "#111827",
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 20,
  },

  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 25,
  },

  card: {
    width: width - 40,
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#EAF2FF",

    borderRadius: 22,
    padding: 18,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 16,
    backgroundColor: "#DCEBFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 20,
    color: "#111827",
    fontFamily: "outfitBold",
    marginBottom: 6,
  },

  desc: {
    fontSize: 15,
    lineHeight: 22,
    color: "#64748B",
    fontFamily: "outfitRegular",
  },
});