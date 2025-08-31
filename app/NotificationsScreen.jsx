import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Animated,
  Pressable,
  Alert
} from 'react-native';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";

const NotificationsScreen = () => {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
   const [showMenu, setShowMenu] = useState(false);
const fadeAnim = useRef(new Animated.Value(0)).current;
  const fetchReports = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const patientUserId = await AsyncStorage.getItem('patientId');
      
      if (!patientUserId) {
        throw new Error('Patient ID not found');
      }

      const response = await fetch(
        `https://backendscan-production.up.railway.app/api/patient/reports/view-reports`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseText = await response.text();
      if (responseText.trim().startsWith('<')) {
        throw new Error('Server returned HTML instead of JSON');
      }

      const data = JSON.parse(responseText);
      
      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }
      
      if (data.success && data.reports) {
        const reportsWithAbsoluteUrls = data.reports.map(report => ({
          ...report,
          fileUrl: report.fileUrl.startsWith('http') 
            ? report.fileUrl 
            : `https://backendscan-production.up.railway.app${report.fileUrl}`
        }));
        
        setReports(reportsWithAbsoluteUrls);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      Alert.alert('Error', error.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  useEffect(() => {
    fetchReports();
  }, []);
  const toggleMenu = () => {
      if (showMenu) {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => setShowMenu(false));
      } else {
        setShowMenu(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    };

  const openPDF = (url) => {
    Linking.openURL(url).catch(err => {
      Alert.alert('Error', 'Failed to open PDF');
      console.error('Failed to open URL:', err);
    });
  };

  const renderItem = ({ item }) => (
     
          
    <View style={styles.card}>
      <Text style={styles.title}>Report</Text>
      <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
      <TouchableOpacity style={styles.button} onPress={() => openPDF(item.fileUrl)}>
        <Text style={styles.buttonText}>View PDF</Text>
      </TouchableOpacity>
        <Text style={styles.titlee}>Appointment: is confirmed</Text>
    </View>

    
    
  );

  if (loading && reports.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
    {showMenu && <Pressable style={styles.overlay} onPress={toggleMenu} />}
      <Text style={styles.header}>Your Medical Reports</Text>
      {reports.length === 0 ? (
        <Text style={styles.noReports}>No reports available.</Text>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
      <View style={styles.navbar}>
       <TouchableOpacity onPress={() => router.push("/upload")}>
         <Ionicons name="camera-outline" size={28} color="#fff" />
       </TouchableOpacity>
       <TouchableOpacity onPress={() => router.push("/profile")}>
         <Ionicons name="person-outline" size={28} color="#fff" />
       </TouchableOpacity>
       <TouchableOpacity onPress={toggleMenu}>
         <Ionicons name="ellipsis-horizontal" size={28} color="#fff" />
       </TouchableOpacity>
     </View>
     {/* Pop-up Menu */}
     {showMenu && (
       <Animated.View
         style={[
           styles.modalContainer,
           {
             opacity: fadeAnim,
             transform: [
               {
                 translateY: fadeAnim.interpolate({
                   inputRange: [0, 1],
                   outputRange: [40, 0],
                 }),
               },
             ],
           },
         ]}
       >
         <TouchableOpacity
           style={styles.menuItem}
           onPress={() => router.push("/doctors")}
         >
           <Text style={styles.menuText}>See Doctors</Text>
         </TouchableOpacity>
         <View style={styles.divider} />
         <TouchableOpacity style={styles.menuItem}onPress={() => router.push("/AiDisclaimerScreen")}>
           <Text style={styles.menuText}>More Advice</Text>
         </TouchableOpacity>
         <View style={styles.divider} />
         <TouchableOpacity style={styles.menuItem}onPress={() => router.push("/AccuracyTechScreen")}>
           <Text style={styles.menuText}>Accuracy Tech</Text>
         </TouchableOpacity>
       </Animated.View>
     )}
    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#F1F5F9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  titlee: {
    fontSize: 18,
    fontWeight: '400',
    color: '#1E293B',
    marginTop:10,
  },
  date: {
    fontSize: 14,
    color: '#64748B',
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noReports: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
   navbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#3B82F6",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    marginLeft:19,
  },
  modalContainer: {
    position: "absolute",
    bottom: 60,
    right: 20,
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 10,
    zIndex: 2,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  menuText: {
    fontSize: 14,
    color: "#3B82F6",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 4,
  },
});