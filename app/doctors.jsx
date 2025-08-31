import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Animated,
  Pressable,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const DoctorsScreen = () => {
  const router = useRouter();
  const [doctorsData, setDoctorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { diagnosis, diagnosisId, imageUri } = useLocalSearchParams();

  useEffect(() => {
 const fetchDoctors = async () => {
  try {
    setLoading(true);
    const [savedRole, savedToken] = await Promise.all([
      AsyncStorage.getItem('role'),
      AsyncStorage.getItem('token'),
    ]);

    if (savedRole === 'doctor') {
      Alert.alert('Restricted', 'Doctors cannot view other doctor profiles');
      router.back();
      return;
    }

    const response = await axios.get(
      'https://backendscan-production.up.railway.app/api/patient/doctors',
      {
        headers: {
          Authorization: `Bearer ${savedToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    
    if (!response.data || !Array.isArray(response.data.doctors)) {
      throw new Error('Invalid response format from server');
    }

    
    const transformed = response.data.doctors.map((doc) => {
const doctorId = doc._id || (typeof doc.userId === 'string' ? doc.userId : doc.userId?._id);
  return {
    id: doctorId,  
    fullName: doc.fullName || 'Unknown Doctor',
    specialization: doc.specialization || 'General Practitioner',
    experience: doc.experience || 'Experience not specified',
    rating: 4.5,
     userId: typeof doc.userId === 'string' ? doc.userId : doc.userId?._id,
    contactNumber: doc.contactNumber,
    email: doc.email,
    hospital: doc.hospital,
    qualifications: doc.qualifications,
    profileImage: doc.profileImage
  };
});


    setDoctorsData(transformed);
  } catch (err) {
    console.error('Fetch Doctors Error:', err);
    
    let errorMessage = 'Failed to load doctors';
    if (err.response) {
      errorMessage = `Server error: ${err.response.status}`;
      if (err.response.data?.message) {
        errorMessage = err.response.data.message;
      }
    } else if (err.request) {
      errorMessage = 'Network error - please check your internet connection';
    }

    Alert.alert('Error', errorMessage);
  } finally {
    setLoading(false);
  }
};

    fetchDoctors();
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


const selectDoctor = async (item) => {
  try {
      if (!item.id) {
      throw new Error('Invalid doctor data - missing ID');
    }
    const token = await AsyncStorage.getItem('token');
    const patientId = await AsyncStorage.getItem('userId');

    if (!diagnosisId || !imageUri) {
      throw new Error('Diagnosis data not found');
    }

    console.log('Sending selection request with:', {
      diagnosisId,
      doctorId: item.id,
      imageUri,
      patientId
    });

    
    const selectResponse = await axios.post(
      `https://backendscan-production.up.railway.app/api/patient/select-doctor/${item.id}`,
      { 
        patientId, 
        diagnosisId, 
        imageUrl: imageUri 
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!selectResponse.data.success) {
      throw new Error(selectResponse.data.message || 'Selection failed');
    }

    
    await AsyncStorage.setItem(
      'selectedDoctor',
      JSON.stringify({
        doctorId: item.id,
        userId: item.userId,
        doctorName: item.fullName,
        specialization: item.specialization,
        selectedAt: new Date().toISOString(),
        diagnosisId,
        imageUri
      })
    );

    
    router.push({
      pathname: '/doctorPage',
      params: {
        doctorId: item.id,
        userId: item.userId, 
        doctorName: item.fullName,
        specialization: item.specialization,
        diagnosisId,
        imageUri,
        selectionConfirmed: 'true',
      
        hospital: item.hospital,
        qualifications: item.qualifications,
        contactNumber: item.contactNumber
      },
    });

  } catch (error) {
    console.error('Doctor selection error:', {
      error: error.response?.data,
      status: error.response?.status,
      message: error.message
    });
    
    Alert.alert(
      'Error',
      error.response?.data?.message || 
      error.message || 
      'Failed to complete doctor selection'
    );
  }
};



  const renderDoctorCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.avatarPlaceholder}>
        <Ionicons name="person" size={32} color="#fff" />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.topRow}>
          <Text style={styles.badgeText}>Professional Doctor</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FACC15" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        <Text style={styles.nameText}>{item.fullName}</Text>
        <Text style={styles.specializationText}>{item.specialization}</Text>
        <Text style={styles.experienceText}>{item.experience}</Text>
        <TouchableOpacity
  style={styles.button}
  onPress={() => selectDoctor(item)}
>
  <Text style={styles.buttonText}>Select</Text>
</TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading Doctors...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showMenu && <Pressable style={styles.overlay} onPress={toggleMenu} />}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={32} color="#2563EB" />
        </TouchableOpacity>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileCircle} />
        ) : (
          <View style={styles.profileCircle} />
        )}
        <Text style={styles.headerTitle}>Doctors</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="filter-outline" size={24} color="#1D4ED8" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search-outline" size={24} color="#1D4ED8" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort By</Text>
        <TouchableOpacity style={styles.sortButton}>
          <Text style={styles.sortButtonText}>A - Z</Text>
          <Ionicons name="chevron-down" size={16} color="#1D4ED8" />
        </TouchableOpacity>
        <Ionicons name="star-outline" size={22} color="#1D4ED8" style={styles.sortIcon} />
        <FontAwesome5 name="venus" size={20} color="#1D4ED8" style={styles.sortIcon} />
        <FontAwesome5 name="mars" size={20} color="#1D4ED8" style={styles.sortIcon} />
      </View>

      {doctorsData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="medkit-outline" size={64} color="#CBD5E1" />
          <Text style={styles.emptyText}>No doctors available</Text>
          <Text style={styles.emptySubtext}>Check back later or try refreshing</Text>
        </View>
      ) : (
        <FlatList
          data={doctorsData}
          keyExtractor={(item) => item.id}
          renderItem={renderDoctorCard}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push('/dashboard')}>
          <Ionicons name="home-outline" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Ionicons name="person-outline" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="ellipsis-horizontal" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

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
          <TouchableOpacity onPress={() => router.push('/AiDisclaimerScreen')} style={styles.menuItem}>
            <Text style={styles.menuText}>More Advice</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity onPress={() => router.push('/AccuracyTechScreen')} style={styles.menuItem}>
            <Text style={styles.menuText}>Accuracy Tech</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1D4ED8',
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#3B82F6',
    marginRight: 190,
    position: "absolute",
    right: 104,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 10,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sortLabel: {
    fontSize: 16,
    color: '#334155',
    marginRight: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 8,
  },
  sortButtonText: {
    fontSize: 14,
    color: '#1D4ED8',
    marginRight: 4,
  },
  sortIcon: {
    marginHorizontal: 4,
  },
  card: {
    flexDirection: 'row',
  backgroundColor: '#E0E7FF',
  borderRadius: 16,
  padding: 12,
  marginBottom: 16,
  alignItems: 'center',
  minHeight: 120,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#CBD5E1',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeText: {
    backgroundColor: '#D6E4FF',
    color: '#1D4ED8',
    fontWeight: 'bold',
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: 'bold',
    color: '#1D4ED8',
    fontSize: 12,
  },
  nameText: {
    marginTop: 6,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1E293B',
  },
  specializationText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  experienceText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  detailsButton: {
    marginTop: 8,
    backgroundColor: '#1D4ED8',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  detailsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
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

export default DoctorsScreen;