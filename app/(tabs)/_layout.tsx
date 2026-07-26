import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2b7fff",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-sharp" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="diagonsis"
        options={{
          title: "Diagnosis",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="medical" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="medicines"
        options={{
          title: "Medicines",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="medkit"
              color={color}
              size={size}
            />
          ),
        }}
      />


      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" 
            color={color} 
            size={size} 
            />
          ),
        }}
      />
    </Tabs>
  );
}