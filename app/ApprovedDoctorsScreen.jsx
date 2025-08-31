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

export default function ApprovedDoctorsScreen() {
  const router = useRouter();
  const [approvedDoctors, setApprovedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API_URL = "https://backendscan-production.up.railway.app/api/admin/approved-doctors";

  const fetchApprovedDoctors = async () => {
    try {
      setRefreshing(true);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Approved doctors data:", response.data);
      setApprovedDoctors(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to fetch approved doctors."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApprovedDoctors();
  }, []);

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
        
        <View style={styles.approvedBadge}>
          <Ionicons name="checkmark-circle" size={20} color="#10b981" />
          <Text style={styles.approvedText}>Approved</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text>Loading approved doctors...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Approved Doctors</Text>
      </View>

      {approvedDoctors.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-circle" size={60} color="#cbd5e1" />
          <Text style={styles.emptyText}>No approved doctors yet</Text>
        </View>
      ) : (
        <FlatList
          data={approvedDoctors}
          renderItem={renderDoctorCard}
          keyExtractor={(item) => item.id || item._id}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={fetchApprovedDoctors}
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
  approvedBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  approvedText: {
    marginLeft: 5,
    color: "#10b981",
    fontWeight: "600",
  },
});