import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../configs/FirebaseConfigs";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignIn() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const router = useRouter();

  const SignIn = async () => {

    if (!email || !password) {
      ToastAndroid.show("All Fields Are Required", ToastAndroid.BOTTOM);
      return;
    }

    try {

      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;

      await user.reload();


      await AsyncStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        email: user.email,
        fullName: user.displayName,

      }));

      router.push('/(tabs)/home');


    } catch (error) {
      console.log(error);

    }



  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 25,
        paddingTop: 50,
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 25,
            paddingTop: 50,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                width: 80,
                height: 80,
                backgroundColor: "#2b7fff",
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 40 }}>🩺</Text>
            </View>

            <Text
              style={{
                fontSize: 28,
                marginTop: 20,
                fontFamily: "outfitBold"
              }}
            >
              Welcome Back
            </Text>

            <Text
              style={{
                color: "gray",
                textAlign: "center",
                marginTop: 8,
                fontFamily: "outfitSemiBold",
                fontSize: 19
              }}
            >
              Sign In To Your AI Doctor Assistant account
            </Text>
          </View>

          {/* Email */}
          <View style={{ marginTop: 40 }}>
            <Text
              style={{
                marginBottom: 8,
                fontFamily: "outfitBold",
                fontSize: 17,

              }}
            >
              Email
            </Text>

            <TextInput
              placeholder="you@example.com"
              keyboardType="email-address"
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 20,
                color: "black",
                padding: 15,
              }}

              onChangeText={(value) => setEmail(value)}
            />
          </View>

          {/* Password */}
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                marginBottom: 8,
                fontFamily: "outfitBold",
                fontSize: 17,
              }}
            >
              Password
            </Text>

            <TextInput
              placeholder="Enter your password"
              secureTextEntry
              style={{
                borderWidth: 1,
                color: "black",
                borderRadius: 20,
                borderColor: "#ddd",
                padding: 15,
              }}
              onChangeText={(value) => setPassword(value)}
            />
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={{
              backgroundColor: "#2b7fff",
              padding: 16,
              borderRadius: 50,
              marginTop: 30,
              alignItems: "center",

            }}

            onPress={SignIn}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontFamily: "outfitExtraBold"
              }}
            >
              Sign In
            </Text>
          </TouchableOpacity>

          {/* Divider */}



          {/* Bottom */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: "auto",
              marginBottom: 20,
            }}
          >
            <Text style={{ color: "gray", fontFamily: "outfitBold", fontSize: 18 }}>
              Don't have an account?
            </Text>

            <TouchableOpacity onPress={() => router.push('/auth/signUp')}>
              <Text
                style={{
                  color: "#2b7fff",
                  fontFamily: "outfitBold",
                  fontSize: 18
                }}
              >
                {" "}
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}