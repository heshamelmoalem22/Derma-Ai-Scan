import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

export default function DoctorMedicalInfoScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    specialization: "",
    experience: "",
    qualifications: "",
    medicalLicense: "",
    hospital: "",
    contactNumber: ""
  });
  const [loading, setLoading] = useState(false);

  const API_URL = "https://backendscan-production.up.railway.app/api/doctor/submit-medical-info";

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const { specialization, experience, qualifications, medicalLicense, hospital, contactNumber } = form;

    if (!specialization || !experience || !qualifications || !medicalLicense || !hospital || !contactNumber) {
      Alert.alert("Error", "Please fill in all fields.");
      return false;
    }

    if (!/^\d{10}$/.test(contactNumber)) {
      Alert.alert("Error", "Please enter a valid 10-digit contact number.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId'); 
      
      
      if (!token || !userId) {
        throw new Error("Authentication information not found. Please login again.");
      }

      
     const payload = {
  specialization: form.specialization.trim(),
  experience: form.experience.trim(),
  qualifications: form.qualifications.trim(),
  medicalLicense: form.medicalLicense.trim(),
  hospital: form.hospital.trim(),
  contactNumber: form.contactNumber.trim()
};
if (userId) {
  payload.userId = userId;
}

      console.log("Submitting payload:", payload);
      
      const response = await axios.post(API_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000 
      });
      
      console.log("API response:", response.data);
      
      Alert.alert(
        "Success", 
        "Medical information submitted successfully. Waiting for admin approval.",
        [{ text: "OK", onPress: () => router.replace("/") }]
      );
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";
      
      
      if (error.response) {
        
        console.error("Server error response:", error.response.data);
        errorMessage = error.response.data.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
       
        console.error("No response received:", error.request);
        errorMessage = "No response from server. Please check your connection.";
      } else {
        
        console.error("Request setup error:", error.message);
        errorMessage = error.message;
      }
      
      Alert.alert("Submission Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Medical Information</Text>
      
      <Text style={styles.label}>Specialization*</Text>
      <TextInput
        style={styles.input}
        placeholder="Cardiology, Neurology, etc."
        value={form.specialization}
        onChangeText={(text) => handleChange("specialization", text)}
        autoCapitalize="words"
      />
      
      <Text style={styles.label}>Experience*</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 10 years"
        value={form.experience}
        onChangeText={(text) => handleChange("experience", text)}
      />
      
      <Text style={styles.label}>Qualifications*</Text>
      <TextInput
        style={styles.input}
        placeholder="MD, PhD, etc."
        value={form.qualifications}
        onChangeText={(text) => handleChange("qualifications", text)}
        autoCapitalize="words"
      />
      
      <Text style={styles.label}>Medical License Number*</Text>
      <TextInput
        style={styles.input}
        placeholder="License number"
        value={form.medicalLicense}
        onChangeText={(text) => handleChange("medicalLicense", text)}
      />
      
      <Text style={styles.label}>Hospital/Clinic*</Text>
      <TextInput
        style={styles.input}
        placeholder="Hospital name"
        value={form.hospital}
        onChangeText={(text) => handleChange("hospital", text)}
        autoCapitalize="words"
      />
      
      <Text style={styles.label}>Contact Number*</Text>
      <TextInput
        style={styles.input}
        placeholder="Hospital contact number"
        keyboardType="phone-pad"
        value={form.contactNumber}
        onChangeText={(text) => handleChange("contactNumber", text)}
        maxLength={10}
      />
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit Information</Text>
        )}
      </TouchableOpacity>
      
      <Text style={styles.note}>
        * All fields are required. Your information will be reviewed by our admin team.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 30,
    textAlign: "center",
  },
  label: {
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
    marginBottom: 15,
    backgroundColor: "#f0f0f0",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  note: {
    marginTop: 20,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
});