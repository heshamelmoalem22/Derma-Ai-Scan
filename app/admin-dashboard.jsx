import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import axios from "axios";

const AdminDashboard = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    doctors: 0,
    scans: 0,
    reviews: 0
  });

 
  const recentActivities = [
    { id: "1", user: "John Doe", action: "Uploaded scan", time: "2 mins ago" },
    { id: "2", user: "Dr. Smith", action: "Reviewed scan", time: "15 mins ago" },
    { id: "3", user: "Admin", action: "Added new user", time: "30 mins ago" },
    { id: "4", user: "Emma Wilson", action: "Registered", time: "1 hour ago" },
    { id: "5", user: "Dr. Johnson", action: "Updated profile", time: "2 hours ago" }
  ];

  const fetchApprovedDoctorsCount = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        "https://backendscan-production.up.railway.app/api/admin/approved-doctors",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.length;
    } catch (error) {
      console.error("Failed to fetch doctors count:", error);
      return 0;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedFullName = await AsyncStorage.getItem("fullName");
        if (storedFullName) {
          setFullName(storedFullName);
        }
        
        const doctorsCount = await fetchApprovedDoctorsCount();
        
        setStats({
          users: 124,
          doctors: doctorsCount,
          scans: 342,
          reviews: 276
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      router.replace("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderStatCard = (title, value, iconName, color) => (
    <View style={[styles.statCard, { backgroundColor: color }]}>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Ionicons name={iconName} size={36} color="rgba(255,255,255,0.7)" />
    </View>
  );

  const renderActivityItem = ({ item }) => (
    <View style={styles.activityItem}>
      <View style={styles.avatarPlaceholder}>
        <Ionicons name="person" size={20} color="#4b5563" />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityUser}>{item.user}</Text>
        <Text style={styles.activityAction}>{item.action}</Text>
      </View>
      <Text style={styles.activityTime}>{item.time}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Hello, {fullName}</Text>
          <Text style={styles.subtitle}>Admin Dashboard</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
       
        <View style={styles.statsContainer}>
          {renderStatCard("Total Users", stats.users, "people", "#3b82f6")}
          {renderStatCard("Doctors", stats.doctors, "medkit", "#10b981")}
          {renderStatCard("Scans", stats.scans, "scan", "#f59e0b")}
          {renderStatCard("Reviews", stats.reviews, "document-text", "#ef4444")}
        </View>

       
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push("/pending-doctors")}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#dcfce7" }]}>
              <Ionicons name="medkit" size={28} color="#10b981" />
            </View>
            <Text style={styles.actionText}>Manage Doctors</Text>
          </TouchableOpacity>
          
         
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push("/ApprovedDoctorsScreen")}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#dbeafe" }]}>
              <Ionicons name="checkmark-circle" size={28} color="#3b82f6" />
            </View>
            <Text style={styles.actionText}>Approved Doctors</Text>
          </TouchableOpacity>
          
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push("/reports")}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#fee2e2" }]}>
              <Ionicons name="analytics" size={28} color="#ef4444" />
            </View>
            <Text style={styles.actionText}>View Reports</Text>
          </TouchableOpacity>
          
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push("/user-management")}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#fef3c7" }]}>
              <Ionicons name="people" size={28} color="#f59e0b" />
            </View>
            <Text style={styles.actionText}>Manage Users</Text>
          </TouchableOpacity>
        </View>

        
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        <FlatList
          data={recentActivities}
          renderItem={renderActivityItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          style={styles.activityList}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#4b5563",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#dbeafe",
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 30,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  statCard: {
    width: "48%",
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 15,
  },
  actionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  actionCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    textAlign: "center",
  },
  activityList: {
    marginBottom: 20,
  },
  activityItem: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityUser: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  activityAction: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 3,
  },
  activityTime: {
    fontSize: 12,
    color: "#94a3b8",
  },
});

export default AdminDashboard;