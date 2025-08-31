import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import doctor1 from '../assets/doc1.jpg';

const imageMap = {
  doctor1,
};

const ReviewResultsScreen = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [doctorImage, setDoctorImage] = useState(null);
  const [atBottom, setAtBottom] = useState(false);
  const scrollRef = useRef(null);
  const { fullName: routeFullName } = useLocalSearchParams();

  useEffect(() => {
    (async () => {
      const doctorToken = await AsyncStorage.getItem('doctorToken');
      const doctorId = await AsyncStorage.getItem('doctorId');
      console.log("Stored doctorId:", doctorId);
      const storedFullName = await AsyncStorage.getItem('fullName');

      if (!doctorToken || !doctorId) {
        Alert.alert('Auth Error', 'Please log in again.');
        return;
      }

      if (routeFullName) {
        setFullName(routeFullName);
      } else if (storedFullName) {
        setFullName(storedFullName);
      }

      try {
        const response = await axios.get(
          'https://backendscan-production.up.railway.app/api/doctor/messages',
          {
            headers: {
              Authorization: `Bearer ${doctorToken}`,
            },
          }
        );

        if (response.data.success) {
      const filteredMessages = response.data.messages.filter((msg) => {
  return msg.to?.toString() === doctorId?.toString();
});
// console.log("doctorId from AsyncStorage:", doctorId);

          setMessages(filteredMessages);
        } else {
          console.warn('Unexpected response format');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleScroll = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        y: atBottom ? 0 : 99999,
        animated: true,
      });
      setAtBottom(!atBottom);
    }
  };

  const goToDoctorProfile = () => {
    router.push({
      pathname: '/DoctorProfileScreen',
      params: { fullName },
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <View style={styles.profileRow}>
          {doctorImage && (
            <Image source={doctorImage} style={styles.profileCircle} />
          )}
          <Text style={styles.greeting}>Dr. {fullName}</Text>
        </View>
      </View>

      <View style={styles.topRightIcon}>
        <TouchableOpacity onPress={goToDoctorProfile}>
          <Ionicons name="person-circle-outline" size={32} color="#007BFF" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Review Results</Text>

      <ScrollView ref={scrollRef} contentContainerStyle={{ paddingBottom: 30 }}>
        {messages.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 40, fontSize: 16 }}>No results yet.</Text>
        ) : (
          messages.map((item) => (
            <View key={item._id} style={styles.card}>
              {item.imageUrl && (
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
              )}
              <Text style={styles.result}>Diagnosis: {item.diagnosisId?.result || 'N/A'}</Text>
              <Text style={styles.comment}>From: {item.diagnosisId?.userId || 'Unknown Patient'}</Text>
              <Text style={styles.comment}>Comment: {item.text || 'No comment provided'}</Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  router.push({
                    pathname: '/GenerateReportScreen',
                    params: {
                      diagnosis: item.diagnosisId?.result,
                      diagnosisId: item.diagnosisId?._id,
                      comment: item.text,
                      imageUrl: item.imageUrl,
                      patientId: item.patientId?._id,
                    },
                  })
                }
              >
                <Text style={styles.buttonText}>Generate Report</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.floatingButton} onPress={toggleScroll}>
        <Ionicons name={atBottom ? 'arrow-up' : 'arrow-down'} size={28} color="#3B82F6" />
      </TouchableOpacity>

      <View style={styles.navbar}>
        <TouchableOpacity>
          <Ionicons name="home-outline" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/DoctorAppointmentsScreen")}>
          <Ionicons name="calendar" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#007BFF', marginTop: 10, marginLeft: 110 },
  card: { backgroundColor: '#eef3fd', borderRadius: 12, padding: 12, marginBottom: 16 },
  image: { width: '100%', height: 200, borderRadius: 8, marginBottom: 10 },
  result: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  comment: { fontSize: 14, color: '#333', marginBottom: 8 },
  button: { backgroundColor: '#007BFF', padding: 10, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  profile: {
    flexDirection: 'row',
    justifyContent: "flex-start",
    marginLeft: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#3B82F6',
    marginRight: 10,
    marginTop: 50,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "500",
    marginTop: 50,
    color: '#333',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 999,
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
    marginLeft: 20,
  },
  topRightIcon: {
    position: 'absolute',
    top: 55,
    right: 29,
    zIndex: 10,
  },
});

export default ReviewResultsScreen;
