import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const tips = [
  {
    id: "1",
    title: "Stay Hydrated",
    description: "Drink at least 8 glasses of water daily.",
    icon: "water-outline",
  },
  {
    id: "2",
    title: "Sleep Well",
    description: "Aim for 7-8 hours of quality rest.",
    icon: "moon-outline",
  },
  {
    id: "3",
    title: "Exercise",
    description: "Walk or exercise for 30 minutes daily.",
    icon: "walk-outline",
  },
  {
    id: "4",
    title: "Healthy Diet",
    description: "Eat more fruits and vegetables every day.",
    icon: "nutrition-outline",
  },
  {
    id: "5",
    title: "Wash Hands",
    description: "Wash your hands frequently to prevent infections.",
    icon: "hand-left-outline",
  },
  {
    id: "6",
    title: "Take Breaks",
    description: "Stand up and stretch every hour.",
    icon: "body-outline",
  },
  {
    id: "7",
    title: "Deep Breathing",
    description: "Practice deep breathing to reduce stress.",
    icon: "leaf-outline",
  },
  {
    id: "8",
    title: "Meditate",
    description: "Spend 10 minutes meditating every day.",
    icon: "flower-outline",
  }
];

const TipCard = React.memo(({ item }) => (
  <View style={styles.card}>
    <View style={styles.iconBox}>
      <Ionicons
        name={item.icon}
        size={28}
        color="#3B82F6"
      />
    </View>

    <Text style={styles.title}>{item.title}</Text>

    <Text style={styles.description}>
      {item.description}
    </Text>
  </View>
));
TipCard.displayName = "TipCard";

const renderItem = ({ item }) => <TipCard item={item} />;

export default function CommonHealthTips() {
  return (
    <FlatList
      data={tips}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      renderItem={renderItem}
      initialNumToRender={4}
      maxToRenderPerBatch={4}
      windowSize={3}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingVertical: 15,
  },

  card: {
    width: 240,
    height: 190,
    backgroundColor: "#E8F1FF",
    borderRadius: 22,
    padding: 20,
    marginRight: 18,

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
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E8F1FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 20,
    color: "#1E293B",
    fontFamily: "outfitBold",
    marginBottom: 10,
  },

  description: {
    fontSize: 17,
    color: "#64748B",
    fontFamily: "outfitRegular",
    lineHeight: 25,
    marginTop: -10,
    width: 210
  },
});
