import React from 'react'
import { Stack } from 'expo-router'
import { useFonts } from "expo-font";

export default function RootLayout() {

    const [fontsloaded] = useFonts({
        "outfitBold": require("../assets/fonts/Outfit-Bold.ttf"),
        "outfitMedium": require("../assets/fonts/Outfit-Medium.ttf"),
        "outfitRegular":require("../assets/fonts/Outfit-Regular.ttf"),
        "outfitSemiBold":require("../assets/fonts/Outfit-SemiBold.ttf"),
        "outfitThin":require("../assets/fonts/Outfit-Thin.ttf"),
        "outfitExtraLight":require("../assets/fonts/Outfit-ExtraLight.ttf"),
        "outfitExtraBold":require("../assets/fonts/Outfit-ExtraBold.ttf")
    });

    if(!fontsloaded){
        return null;
    }
  return (
    <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name="(tabs)"></Stack.Screen>
        <Stack.Screen name="index"></Stack.Screen>
        <Stack.Screen name="diagnosisResult"></Stack.Screen>
        <Stack.Screen name="auth"></Stack.Screen>
        <Stack.Screen name="AllCommonHealthTips"></Stack.Screen>
    </Stack>
  )
}