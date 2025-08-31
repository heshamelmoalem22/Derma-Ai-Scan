import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import doctor1 from '../assets/doc1.jpg';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);

  const API_URL = "https://backendscan-production.up.railway.app/api/auth/login";

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(API_URL, { email, password });
      const { token, user } = response.data;
  const patientUserId = user.patientUserId || '';
   const tokenKey = user.role === "doctor" ? "doctorToken" : "token";
      
     const dataToStore = [
  ['email', user.email],
  // ['token', token],
  [tokenKey, token],
  ['fullName', user.fullName],
  ['role', user.role],
  ['userId', user.id],
  ['isApproved', String(user.isApproved)],
  ['patientId', patientUserId]
];

      await AsyncStorage.multiSet(dataToStore);

switch (user.role) {
  case "admin":
    router.push({ pathname: "/admin-dashboard", params: { fullName: user.fullName } });
    break;
  case "doctor":
  await AsyncStorage.setItem('doctorId', user.id);
  router.push({ pathname: "/review", params: { fullName: user.fullName } });

    break;
  default:
    router.push({ pathname: "/dashboard", params: { fullName: user.fullName } });
}

    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={32} color="#2563EB" />
      </TouchableOpacity>
      <Image source={require("../assets/result2.jpg")} style={styles.logo} />
      <Text style={styles.title}>Welcome Back</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="example@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Enter Password"
          secureTextEntry={secureText}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.icon}>
          <Ionicons name={secureText ? "eye-off" : "eye"} size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => Alert.alert("Forgot Password?", "Reset feature coming soon!")}
      >
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Log In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 44,
    left: 7,
    zIndex: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 20,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  icon: {
    position: "absolute",
    right: 15,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    color: "#007bff",
    fontSize: 14,
    marginBottom: 20,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});