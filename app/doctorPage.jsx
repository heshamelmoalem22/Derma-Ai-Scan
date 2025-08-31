// Updated doctorPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const TIME_SLOTS = ['10:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'];

const DoctorProfile = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [doctorData, setDoctorData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [token, setToken] = useState(null);
  const [messageText, setMessageText] = useState('Please review my diagnosis');
  const [patientUserId, setPatientUserId] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { 
    doctorId, 
    diagnosisId, 
    imageUri,
    doctorName,
    specialization,
    hospital,
    qualifications,
    contactNumber
  } = useLocalSearchParams();

  
  useEffect(() => {
    (async () => {
      const savedImage = await AsyncStorage.getItem('profileImage');
      if (savedImage) setProfileImage(savedImage);
    })();
  }, []);
useEffect(() => {
  const storeSelectedDoctor = async () => {
    try {
      await AsyncStorage.setItem('selectedDoctor', JSON.stringify({ id: doctorId }));
    } catch (error) {
      console.error('Error saving selected doctor:', error);
    }
  };

  storeSelectedDoctor();
}, [doctorId]);

  
  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(
          `https://backendscan-production.up.railway.app/api/patient/doctors/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        
        setDoctorData({
          fullName: doctorName || response.data.doctor?.fullName,
          specialization: specialization || response.data.doctor?.specialization,
          experience: response.data.doctor?.experience || '10 years',
          rating: 4.5,
          patientsCount: 30,
          workingHours: '9AM - 4PM',
          hospital: hospital || response.data.doctor?.hospital,
          qualifications: qualifications || response.data.doctor?.qualifications,
          contactNumber: contactNumber || response.data.doctor?.contactNumber
        });

      } catch (error) {
        console.error('Error fetching doctor data:', error);
       
        if (doctorName) {
          setDoctorData({
            fullName: doctorName,
            specialization: specialization,
            experience: '10 years',
            rating: 4.5,
            patientsCount: 30,
            workingHours: '9AM - 4PM',
            hospital,
            qualifications,
            contactNumber
          });
        } else {
          Alert.alert('Error', error.response?.data?.message || 'Failed to load doctor profile');
        }
      }
    };

    fetchDoctorProfile();
  }, [doctorId]);

  
  useEffect(() => {
    const fetchUserData = async () => {
      const [savedToken, storedPatientId] = await Promise.all([
        AsyncStorage.getItem('token'),
        AsyncStorage.getItem('userId')
      ]);

      if (!savedToken) {
        Alert.alert('Auth Error', 'Please log in again.');
        router.push('/login');
        return;
      }

      setToken(savedToken);
      setPatientUserId(storedPatientId || '');
    };

    fetchUserData();
  }, []);


const handleBookAndSendDiagnosis = async () => {
  try {
    setIsProcessing(true);
    
   
    const selection = await AsyncStorage.getItem('selectedDoctor');
    if (!selection) {
      throw new Error('pick doctor frist');
    }

    const selectionData = JSON.parse(selection);
    if (selectionData.id !== doctorId) {
      throw new Error('pick doctor frist');
    }

    
    if (!selectedDate || !selectedTime) {
      throw new Error('choose time and date frist');
    }

   
    const formatTime = (timeStr) => {
      const [time, period] = timeStr.split(' ');
      let [hours, minutes = '00'] = time.split(':');
      if (period === 'PM' && hours !== '12') hours = String(Number(hours) + 12);
      if (period === 'AM' && hours === '12') hours = '00';
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    };

    const formattedTime = selectedTime.includes(' ') 
      ? formatTime(selectedTime) 
      : selectedTime;

   
    const appointmentData = {
      patientId: patientUserId,
      doctorId,
      date: selectedDate,
      time: formattedTime,
      status: 'pending',
      message: messageText.trim(),
      diagnosisId,
      imageUrl: imageUri,
      selectionProof: selectionData
    };

    
    const diagnosisData = {
      doctorId,
      diagnosisId,
      messageText: messageText.trim(),
      patientId: patientUserId,
      imageUrl: imageUri,
      selectionProof: selectionData
    };
    const [appointmentResponse, diagnosisResponse] = await Promise.all([
      axios.post(
        'https://backendscan-production.up.railway.app/api/patient/appointments',
        appointmentData,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
      axios.post(
        'https://backendscan-production.up.railway.app/api/patient/send-diagnosis',
        diagnosisData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
    ]);
    if (!appointmentResponse.data.success || !diagnosisResponse.data.success) {
      throw new Error(appointmentResponse.data.message || diagnosisResponse.data.message || 'فشل في إتمام العملية');
    }

    router.push({
      pathname: '/payment',
      params: {
        appointmentId: appointmentResponse.data.appointmentId,
        diagnosisId,
        doctorId,
        doctorName: doctorData.fullName,
        specialization: doctorData.specialization,
        date: selectedDate,
        time: selectedTime,
        amount: '80', 
        imageUri
      }
    });

  } catch (error) {
    console.error('خطأ:', error);
    let errorMessage = error.message || 'فشل في إتمام العملية';
    
    if (error.response) {
      errorMessage = error.response.data?.message || 
                    error.response.data?.error ||
                    JSON.stringify(error.response.data);
    }
    
    Alert.alert('خطأ', errorMessage);
  } finally {
    setIsProcessing(false);
  }
};

  if (!doctorData) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1D4ED8" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 150 }} style={styles.container}>
      
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={37} color="#1e5eff" />
          </TouchableOpacity>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileCircle} />
          ) : (
            <View style={styles.profileCircle} />
          )}
          <Text style={styles.headerTitle}>Doctor Profile</Text>
        </View>

       
        <View style={styles.card}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={50} color="#fff" />
          </View>

          <View style={styles.experienceBubble}>
            <Text style={styles.experienceText}>
              {doctorData.experience || '10'} yrs{"\n"}experience
            </Text>
          </View>

          <Text style={styles.nameText}>{doctorData.fullName}</Text>
          <Text style={styles.specializationText}>{doctorData.specialization}</Text>
          <Text style={styles.hospitalText}>{doctorData.hospital}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={18} color="#FACC15" />
              <Text style={styles.statText}>{doctorData.rating || '4.5'}</Text>
            </View>
            <View style={styles.statItem}>
              <FontAwesome5 name="user-friends" size={18} color="#1D4ED8" />
              <Text style={styles.statText}>{doctorData.patientsCount || '30'}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="call-outline" size={18} color="#1D4ED8" />
              <Text style={styles.statText}>{doctorData.contactNumber || 'N/A'}</Text>
            </View>
          </View>
        </View>

       
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Ionicons name="medal-outline" size={20} color="#1D4ED8" />
            <Text style={styles.detailText}>{doctorData.qualifications || 'MD'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={20} color="#1D4ED8" />
            <Text style={styles.detailText}>{doctorData.hospital || 'Not specified'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color="#1D4ED8" />
            <Text style={styles.detailText}>{doctorData.workingHours || '9AM - 4PM'}</Text>
          </View>
        </View>

       
        <View style={styles.messageContainer}>
          <Text style={styles.sectionTitle}>Message to Doctor</Text>
          <TextInput
            style={styles.messageInput}
            multiline
            numberOfLines={4}
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Explain your condition..."
            placeholderTextColor="#94a3b8"
          />
        </View>

       
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Book Appointment</Text>
          
          <Text style={styles.subtitle}>Select Date</Text>
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: '#1D4ED8' },
            }}
            theme={{
              selectedDayBackgroundColor: '#1D4ED8',
              todayTextColor: '#1D4ED8',
              arrowColor: '#1D4ED8',
            }}
            style={styles.calendar}
          />

          <Text style={styles.subtitle}>Available Time Slots</Text>
          <View style={styles.timeSlotsWrapper}>
            {TIME_SLOTS.map((slot) => (
              <TouchableOpacity
                key={slot}
                style={[
                  styles.timeSlot,
                  selectedTime === slot && styles.timeSlotSelected,
                ]}
                onPress={() => setSelectedTime(slot)}
              >
                <Text style={selectedTime === slot ? styles.selectedTimeText : styles.timeText}>
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
  style={[styles.actionButton, styles.combinedButton]}
  onPress={handleBookAndSendDiagnosis}
  disabled={isProcessing || !selectedDate || !selectedTime}
>
  {isProcessing ? (
    <ActivityIndicator color="#fff" />
  ) : (
    <Text style={styles.buttonText}>
      {!selectedDate || !selectedTime 
        ? 'Select Appointment' 
        : `send Booking&Diagnosis`}
    </Text>
  )}
</TouchableOpacity>
                  </View>
      </ScrollView>
      
     
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push('/dashboard')}>
          <Ionicons name="home-outline" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Ionicons name="person-outline" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/more')}>
          <Ionicons name="ellipsis-horizontal" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingTop: 35,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  back:{marginTop:18},
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1D4ED8',
    marginRight: 37,
    marginTop: 20,
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#3B82F6',
    position: "absolute",
    right: 295,
    marginTop: 20,
  },
  card: {
    backgroundColor: '#CBD5E1',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    marginTop: 16,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#64748B',
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  experienceBubble: {
    backgroundColor: '#1D4ED8',
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    borderRadius: 20,
  },
  experienceText: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 8,
  },
  specializationText: {
    fontSize: 16,
    color: '#1D4ED8',
    fontWeight: '600',
    marginTop: 4,
  },
  hospitalText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    fontSize: 12,
    color: '#1D4ED8',
    marginTop: 4,
    textAlign: 'center',
  },
  detailsSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#334155',
    marginLeft: 10,
  },
  sectionContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
    marginTop: 8,
  },
  messageContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  messageInput: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    marginTop: 8,
  },
  calendar: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  timeSlotsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  timeSlot: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1D4ED8',
    backgroundColor: '#F8FAFC',
  },
  timeSlotSelected: {
    backgroundColor: '#1D4ED8',
  },
  timeText: {
    color: '#1D4ED8',
    fontSize: 14,
  },
  selectedTimeText: {
    color: 'white',
    fontSize: 14,
  },
  actionsContainer: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    width:250,
    marginLeft:46,
  },
  bookButton: {
    backgroundColor: '#1D4ED8',
  },
  diagnosisButton: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  combinedButton: {
  backgroundColor: '#1D4ED8',
  
},
  navbar: {
    position: 'absolute',
    bottom: 0,
    width: '88%',
    marginLeft: 24,
    paddingVertical: 12,
    backgroundColor: '#3B82F6',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default DoctorProfile;