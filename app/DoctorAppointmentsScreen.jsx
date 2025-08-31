import React, { useRef, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  StyleSheet, 
  TouchableOpacity,
  RefreshControl,
  Alert,
  FlatList,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const DoctorAppointmentsScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [atBottom, setAtBottom] = useState(false);
  const router = useRouter();
  const flatListRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setRefreshing(true);
        const token = await AsyncStorage.getItem('doctorToken');
        const savedFullName = await AsyncStorage.getItem('fullName');
        if (savedFullName) setFullName(savedFullName);

        const response = await axios.get(
          'https://backendscan-production.up.railway.app/api/doctor/appointments',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          setAppointments(response.data.appointments);
        }
      } catch (error) {
        console.error("Error fetching appointments", error);
        Alert.alert("Error", "Failed to load appointments");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const token = await AsyncStorage.getItem('doctorToken');
      const response = await axios.get(
        'https://backendscan-production.up.railway.app/api/doctor/appointments',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setAppointments(response.data.appointments);
      }
    } catch (error) {
      console.error("Refresh error", error);
    } finally {
      setRefreshing(false);
    }
  };

  const toggleScroll = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: atBottom ? 0 : 99999,
        animated: true,
      });
      setAtBottom(!atBottom);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const renderAppointment = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.dateText}>
          {formatDate(item.date)} • {formatTime(item.time)}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.patientInfo}>
        <Ionicons name="person-circle-outline" size={24} color="#4B5563" />
        <Text style={styles.patientId}>Patient ID: {item.patientId}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#10B981' }]}
   onPress={() => {
  Alert.alert(
    "Confirm Appointment",
    "Are you sure you want to confirm this appointment?",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "OK",
        onPress: async () => {
          try {
            const notificationsKey = `notifications_${item.patientId}`;
            const confirmedKey = 'confirmedAppointments';

            const existingNotifications = await AsyncStorage.getItem(notificationsKey);
            const oldNotifications = existingNotifications ? JSON.parse(existingNotifications) : [];

            const newNotification = {
              title: "Appointment Confirmed",
              message: `Your appointment on ${formatDate(item.date)} at ${formatTime(item.time)} has been confirmed.`,
              timestamp: new Date().toISOString(),
              appointmentId: item._id
            };

            await AsyncStorage.setItem(
              notificationsKey,
              JSON.stringify([newNotification, ...oldNotifications])
            );

            
            const existingConfirmed = await AsyncStorage.getItem(confirmedKey);
            const confirmedList = existingConfirmed ? JSON.parse(existingConfirmed) : [];

            const newConfirmed = {
              ...item,
              dateFormatted: formatDate(item.date),
              timeFormatted: formatTime(item.time),
            };

            await AsyncStorage.setItem(
              confirmedKey,
              JSON.stringify([newConfirmed, ...confirmedList])
            );
setAppointments((prev) =>
  prev.filter((app) => app._id !== item._id)
);


            Alert.alert("Confirmed", "Appointment has been confirmed and saved.");
          } catch (err) {
            console.error("Confirm error", err);
            Alert.alert("Error", "Failed to confirm.");
          }
        }
      }
    ]
  );
}}


        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Dr. {fullName}</Text>
          <Text style={styles.subtitle}>Upcoming Appointments</Text>
        </View>
      </View>

      {appointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={60} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No Appointments</Text>
          <Text style={styles.emptyText}>You don't have any upcoming appointments</Text>
        </View>
      ) : (
        <>
          <FlatList
            ref={flatListRef}
            data={appointments}
            keyExtractor={(item) => item._id}
            renderItem={renderAppointment}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh} 
                tintColor="#3B82F6"
              />
            }
          />
          <TouchableOpacity style={styles.fab} onPress={toggleScroll}>
            <Ionicons 
              name={atBottom ? 'chevron-up-outline' : 'chevron-down-outline'} 
              size={28} 
              color="white" 
            />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 16
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937'
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 12
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937'
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  patientId: {
    marginLeft: 10,
    fontSize: 16,
    color: '#4B5563'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 60,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 20
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 24
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#2563EB',
    borderRadius: 30,
    padding: 14,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  }
});

export default DoctorAppointmentsScreen;


// onPress={async () => {
//   try {
//     // حفظ الإشعار محليًا بناءً على patientId
//     const notificationsKey = `notifications_${item.patientId}`;

//     // جلب الإشعارات القديمة
//     const existing = await AsyncStorage.getItem(notificationsKey);
//     const oldNotifications = existing ? JSON.parse(existing) : [];

//     const newNotification = {
//       title: "Appointment Confirmed",
//       message: `Your appointment on ${formatDate(item.date)} at ${formatTime(item.time)} has been confirmed.`,
//       timestamp: new Date().toISOString(),
//       appointmentId: item._id
//     };

//     const updatedNotifications = [newNotification, ...oldNotifications];

//     await AsyncStorage.setItem(notificationsKey, JSON.stringify(updatedNotifications));

//     // تحديث حالة الموعد في الواجهة
//     setAppointments(prev =>
//       prev.map(app => app._id === item._id ? { ...app, status: 'confirmed' } : app)
//     );

//     Alert.alert("Confirmed", "Appointment has been confirmed and patient notified.");

//   } catch (error) {
//     console.error("Error confirming appointment:", error);
//     Alert.alert("Error", "Failed to confirm appointment");
//   }
// }}
// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const PatientNotificationsScreen = () => {
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       const patientId = '682365ecd39b47cafd740bc3'; // استبدله بـ patientId الحقيقي من AsyncStorage إذا متاح
//       const notificationsKey = `notifications_${patientId}`;

//       const stored = await AsyncStorage.getItem(notificationsKey);
//       if (stored) {
//         setNotifications(JSON.parse(stored));
//       }
//     };

//     fetchNotifications();
//   }, []);

//   const renderItem = ({ item }) => (
//     <View style={styles.notificationCard}>
//       <Text style={styles.title}>{item.title}</Text>
//       <Text style={styles.message}>{item.message}</Text>
//       <Text style={styles.date}>{new Date(item.timestamp).toLocaleString()}</Text>
//     </View>
//   );

//   return (
//     <FlatList
//       data={notifications}
//       keyExtractor={(item, index) => index.toString()}
//       renderItem={renderItem}
//       contentContainerStyle={styles.container}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//   },
//   notificationCard: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   title: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     color: '#111',
//   },
//   message: {
//     marginTop: 4,
//     color: '#444',
//   },
//   date: {
//     marginTop: 8,
//     fontSize: 12,
//     color: '#888',
//   },
// });

// export default PatientNotificationsScreen;
