import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function SignupScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    mobileNumber: "",
    dateOfBirth: "",
    role: "patient", 
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = "https://backendscan-production.up.railway.app/api/auth/register";

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const { fullName, email, password, mobileNumber, dateOfBirth } = form;

    if (!fullName || !email || !password || !mobileNumber || !dateOfBirth) {
      Alert.alert("Error", "Please fill in all fields.");
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return false;
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      Alert.alert("Error", "Please enter a valid 10-digit mobile number.");
      return false;
    }

    return true;
  };
  

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);

    const dataToSend = {
      fullName: form.fullName,
      email: form.email,
      password: form.password,
      role: form.role,
      mobilenumber: form.mobileNumber,
      birthDate: form.dateOfBirth,
    };

    // try {
    //   const response = await axios.post(API_URL, dataToSend);
    //   console.log("✅ Signup response:", response.data);
    //    await AsyncStorage.setItem('fullName', form.fullName);
    //   Alert.alert("Signup Successful", `Welcome, ${form.fullName}!`);
    //  router.push("/dashboard");
  


    // } catch (error) {
    //   console.error("❌ Signup error:", error.response?.data || error.message);
    //   Alert.alert(
    //     "Signup Failed",
    //     error.response?.data?.message || "Something went wrong."
    //   );
    // } finally {
    //   setLoading(false);
    // }
     try {
    const response = await axios.post(API_URL, dataToSend);
    const { token, user } = response.data;
    await AsyncStorage.multiSet([
      ['token', token],
      ['fullName', form.fullName],
      ['patientId', response.data.user.patientUserId || ''],
      ['doctorUserId', response.data.user.doctorUserId || ''],
      ['role', form.role],
      ['userId', user.id],
      ['isApproved', String(user.isApproved || false)]
    ]);
  if (form.role === "doctor") {
    
    router.push("/doctor-medical-info");
  } else {
    Alert.alert(
  "Signup Successful",
  `Welcome, ${form.fullName}!\nEdit your profile please.`,
  [
    {
      text: "Later",
      style: "cancel",
    },
    {
      text: "Edit",
      onPress: () => router.push("/profile"), 
    },
  ]
);

    router.push("/dashboard");
 }
  } catch (error) {
    console.error("❌ Signup error:", error);
    Alert.alert(
      "Signup Failed",
      error.response?.data?.message || "Something went wrong."
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

      <Text style={styles.title}>New Account</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={form.fullName}
        onChangeText={(text) => handleChange("fullName", text)}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="example@example.com"
        keyboardType="email-address"
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
      />

      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        keyboardType="phone-pad"
        value={form.mobileNumber}
        onChangeText={(text) => handleChange("mobileNumber", text)}
      />

      <Text style={styles.label}>Date of Birth</Text>
      <TextInput
        style={styles.input}
        placeholder="DD / MM / YYYY"
        value={form.dateOfBirth}
        onChangeText={(text) => handleChange("dateOfBirth", text)}
      />

      <Text style={styles.label}>Role</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.role}
          onValueChange={(value) => handleChange("role", value)}
          style={styles.picker}
        >
          <Picker.Item label="Patient" value="patient" />
          <Picker.Item label="Doctor" value="doctor" />
        </Picker>
      </View>

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Enter Password"
          secureTextEntry={!passwordVisible}
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
        />
        <TouchableOpacity
          onPress={() => setPasswordVisible(!passwordVisible)}
          style={styles.icon}
        >
          <Ionicons
            name={passwordVisible ? "eye" : "eye-off"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.termsText}>
        By continuing, you agree to{" "}
        <Text style={styles.linkText}>Terms of Use</Text> and{" "}
        <Text style={styles.linkText}>Privacy Policy</Text>.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
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
  pickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
  },
  picker: {
    width: "100%",
    height: 45,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  icon: {
    position: "absolute",
    right: 15,
  },
  termsText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  linkText: {
    color: "#007bff",
    fontWeight: "bold",
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
