import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../../configs/FirebaseConfigs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
export default function SignUp() {
  const router = useRouter();

  const [fullName, setFullName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();


  const createAccount = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      ToastAndroid.show("All Fields Are Required", ToastAndroid.BOTTOM);
      return;
    }

    if (password !== confirmPassword) {
      ToastAndroid.show("Password Does Not Match", ToastAndroid.BOTTOM);
      return;
    }

    if (password.length < 8) {
      ToastAndroid.show("Password Length Should At Least 8 Characters", ToastAndroid.BOTTOM);
      return;
    }

    try {

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: fullName });

      await AsyncStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        email: user.email,
        fullName: fullName,
      }))



      ToastAndroid.show("Account Created Successfully", ToastAndroid.BOTTOM);
      router.push('/(tabs)/home');

    } catch (e) {
      console.log(e);
    }

  }

  return (
    <SafeAreaView style={styles.container}>

      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={30}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoIcon}>🩺</Text>
          </View>

          <Text style={styles.title}>Create Account</Text>

          <Text style={styles.subtitle}>
            Join your AI Doctor Assistant today
          </Text>
        </View>

        {/* Full Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.icon}>👤</Text>

            <TextInput
              placeholder="John Doe"
              style={styles.input}
              placeholderTextColor="#888"
              onChangeText={(value) => setFullName(value)}
            />
          </View>
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.icon}>📧</Text>

            <TextInput
              placeholder="you@example.com"
              keyboardType="email-address"
              style={styles.input}
              placeholderTextColor="#888"
              onChangeText={(value) => setEmail(value)}
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.icon}>🔒</Text>

            <TextInput
              placeholder="Create a password"
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#888"
              onChangeText={(value) => setPassword(value)}
            />

          </View>
        </View>

        {/* Confirm Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.icon}>🔒</Text>

            <TextInput
              placeholder="Re-enter your password"
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#888"
              onChangeText={(value) => setConfirmPassword(value)}
            />
          </View>
        </View>



        {/* Button */}
        <TouchableOpacity style={styles.button} onPress={createAccount}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Bottom */}
        <View style={styles.footer}>
          <Text style={{
            color: "#777",
            fontFamily: "outfitBold", fontSize: 18
          }}>
            Already have an account?
          </Text>

          <TouchableOpacity onPress={() => router.push('/auth/signIn')}>
            <Text style={styles.signIn}> Sign In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const PRIMARY = "#2b7fff";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    paddingTop: 20,
  },

  header: {
    alignItems: "center",
    marginTop: 20,
  },

  logo: {
    width: 70,
    height: 70,
    backgroundColor: PRIMARY,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  logoIcon: {
    fontSize: 32,
    color: "#fff",
  },

  title: {
    fontSize: 28,
    marginTop: 15,
    fontFamily: "outfitBold"
  },

  subtitle: {
    color: "#777",
    marginTop: 5,
    fontSize: 15,
    fontFamily: "outfitMedium"
  },

  inputGroup: {
    marginTop: 18,
  },

  label: {
    marginBottom: 8,
    fontWeight: "600",
    fontSize: 15,
    fontFamily: "outfitBold"
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d0d7ff",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 52,
  },

  icon: {
    fontSize: 18,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },

  checkboxContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "flex-start",
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },

  checkboxText: {
    flex: 1,
    marginLeft: 10,
    color: "#666",
    lineHeight: 20,
    fontFamily: "outfitMedium"
  },

  link: {
    color: PRIMARY,
    fontWeight: "600",
  },

  button: {
    backgroundColor: PRIMARY,
    marginTop: 25,
    height: 56,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "outfitExtraBold",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },

  dividerText: {
    marginHorizontal: 10,
    color: "#888",
    fontSize: 12,
  },

  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
  },

  socialButton: {
    width: 55,
    height: 55,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,

  },

  socialIcon: {
    fontSize: 24,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 50,
    marginBottom: 20,
  },

  signIn: {
    color: PRIMARY,
    fontFamily: "outfitBold",
    fontSize: 18
  },
});