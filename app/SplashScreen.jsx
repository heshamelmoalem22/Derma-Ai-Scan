import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  // const [username, setUsername] = useState("");
  const router = useRouter();
  



  return (
    <View style={styles.container}>
      <Image source={require("../assets/result2.jpg")} style={styles.logo} />
      <Text style={styles.title}>Derm Ai Scan </Text>
      <Text style={styles.subtitle}>Dermatology Center</Text>

      {/* <TextInput
        style={styles.input}
        placeholder="Enter Username"
        value={username}
        onChangeText={setUsername}
      /> */}

      <TouchableOpacity style={styles.button} onPress={() => router.push("/login")}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.signupButton]} onPress={() => router.push("/signup")}>
        <Text style={styles.signupText}>Sign Up</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={[styles.button, styles.uploadButton]} onPress={() => router.push("/upload")}>
        <Text style={styles.buttonText}>Go to Upload Screen</Text>
      </TouchableOpacity> */}

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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 5,
  },
    logo: {
    width: 120, 
    height: 120,
    marginBottom: 20,
    resizeMode: "contain",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupButton: {
    backgroundColor: "#cce0ff",
  },
  signupText: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
