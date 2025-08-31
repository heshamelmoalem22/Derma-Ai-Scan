import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

import doctorDefault from '../assets/doc1.jpg';

const DoctorProfileScreen = () => {
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmedAppointments, setConfirmedAppointments] = useState([]);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['token', 'email', 'confirmedAppointments']);
    Alert.alert('Logged Out', 'You have been logged out.');
    router.replace('/');
  };

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('doctorToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(
          'https://backendscan-production.up.railway.app/api/doctor/profile',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success && response.data.doctor) {
          setDoctor(response.data.doctor);
          
          await AsyncStorage.setItem('doctorData', JSON.stringify(response.data.doctor));
        } else {
          throw new Error('Failed to fetch doctor profile');
        }
      } catch (error) {
        console.error('Error fetching doctor profile:', error);
        Alert.alert('Error', 'Could not load doctor profile');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, []);
  useEffect(() => {
  const fetchConfirmedAppointments = async () => {
    const data = await AsyncStorage.getItem('confirmedAppointments');
    if (data) {
      setConfirmedAppointments(JSON.parse(data));
    }
  };
  fetchConfirmedAppointments();
}, []);
useEffect(() => {
  const interval = setInterval(async () => {
    setConfirmedAppointments([]);
    await AsyncStorage.removeItem('confirmedAppointments');
    console.log('Confirmed appointments cleared after 2 minutes.');
  }, 2 * 60 * 1000);

  return () => clearInterval(interval); 
}, []);



  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} color="#3B82F6" />;
  }

  if (!doctor) {
    return (
      <View style={styles.container}>
        <Text style={styles.name}>Doctor not found.</Text>
      </View>
    );
  }

  // const imageSource = imageMap[doctor.imageKey];

 return (
  <View style={styles.container}>
    <View style={styles.customHeader}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>My Profile</Text>
    </View>


      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Image style={styles.profileImage} />
        {doctor && (
          <>
            <Text style={styles.name}>Dr. {doctor.fullName}</Text>
            <Text style={styles.info}>Specialization: {doctor.specialization}</Text>
            <Text style={styles.info}>Email: {doctor.email}</Text>
            <Text style={styles.info}>Hospital: {doctor.hospital}</Text>
            <Text style={styles.info}>Contact: {doctor.contactNumber}</Text>
            <Text style={styles.info}>Experience: {doctor.experience}</Text>
            <Text style={styles.info}>Qualifications: {doctor.qualifications}</Text>
            <Text style={styles.info}>License: {doctor.medicalLicense}</Text>
          </>
        )}

      {confirmedAppointments.length > 0 && (
        <View style={{ width: '100%', marginTop: 30 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Confirmed Appointments:
          </Text>
          {confirmedAppointments.map((app, index) => (
            <View
              key={index}
              style={{
                backgroundColor: '#F3F4F6',
                padding: 12,
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              <Text style={{ fontWeight: '600', color: '#1F2937' }}>
                Patient ID: {app.patientId}
              </Text>
              <Text>Date: {app.dateFormatted}</Text>
              <Text>Time: {app.timeFormatted}</Text>
              <Text>Status: ✅ Confirmed</Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>
);

};

export const options = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
customHeader: {
  width: '100%',
  height: 60,
  backgroundColor: '#3B82F6',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  marginBottom: 20,
  borderBottomWidth: 1,
  borderBottomColor: '#ccc',
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
},
backButton: {
  position: 'absolute',
  left: 10,
  top: 14,
},
headerTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#fff',
},

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DoctorProfileScreen;
