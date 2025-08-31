import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

export default function PendingDoctorsScreen() {
  const router = useRouter();
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API_URL = "https://backendscan-production.up.railway.app/api/admin/pending-doctors";

  const fetchPendingDoctors = async () => {
    try {
      setRefreshing(true);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Pending doctors data:", response.data);
      setPendingDoctors(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to fetch pending doctors."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const handleApprove = async (doctorId) => {
    try {
      console.log("Approving doctor with ID:", doctorId);
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `https://backendscan-production.up.railway.app/api/admin/approve-doctor/${doctorId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      Alert.alert("Success", "Doctor approved successfully!");
      fetchPendingDoctors();
    } catch (error) {
      console.error("Full approval error:", error);
      console.error("Error response:", error.response?.data);
      
      let errorMessage = "Failed to approve doctor.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert("Error", errorMessage);
    }
  };

  const handleReject = async (doctorId) => {
    try {
      console.log("Rejecting doctor with ID:", doctorId);
      const token = await AsyncStorage.getItem('token');
      await axios.delete(
        `https://backendscan-production.up.railway.app/api/admin/reject-doctor/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      Alert.alert("Success", "Doctor rejected successfully.");
      fetchPendingDoctors();
    } catch (error) {
      console.error("Full rejection error:", error);
      console.error("Error response:", error.response?.data);
      
      let errorMessage = "Failed to reject doctor.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert("Error", errorMessage);
    }
  };

  const renderDoctorCard = ({ item }) => {
   
    const doctorId = item.id || item._id;
    
  
    const user = item.userId || {};
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="person-circle-outline" size={36} color="#3b82f6" />
          <View style={styles.userInfo}>
            <Text style={styles.doctorName}>{user.fullName || "No name"}</Text>
            <Text style={styles.doctorEmail}>{user.email || "No email"}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="medkit-outline" size={18} color="#64748b" />
          <Text style={styles.detailText}>{item.specialization}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="school-outline" size={18} color="#64748b" />
          <Text style={styles.detailText}>{item.qualifications}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="business-outline" size={18} color="#64748b" />
          <Text style={styles.detailText}>{item.hospital}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="call-outline" size={18} color="#64748b" />
          <Text style={styles.detailText}>{item.contactNumber}</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#10b981" }]}
            onPress={() => handleApprove(doctorId)}
          >
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#ef4444" }]}
            onPress={() => handleReject(doctorId)}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text>Loading pending doctors...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pending Doctor Approvals</Text>
      </View>

      {pendingDoctors.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-circle" size={60} color="#cbd5e1" />
          <Text style={styles.emptyText}>No pending doctors for approval</Text>
        </View>
      ) : (
        <FlatList
          data={pendingDoctors}
          renderItem={renderDoctorCard}
          keyExtractor={(item) => item.id || item._id}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={fetchPendingDoctors}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#94a3b8",
    marginTop: 20,
    textAlign: "center",
  },
  listContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  userInfo: {
    marginLeft: 10,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  doctorEmail: {
    fontSize: 14,
    color: "#64748b",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 10,
    color: "#64748b",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});