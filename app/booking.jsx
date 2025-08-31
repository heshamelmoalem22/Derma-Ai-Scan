import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const BookingPage = () => {
  const router = useRouter();
  const { date } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={28} color="#1D4ED8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking</Text>
      </View>

 
      <View style={styles.card}>
        <Ionicons name="calendar-outline" size={80} color="#1D4ED8" />
        <Text style={styles.dateText}>
          {date ? `You selected:\n${date}` : "No date selected"}
        </Text>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => alert(`Appointment booked for ${date}!`)}
        >
          <Text style={styles.confirmButtonText}>Confirm Appointment</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default BookingPage;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingTop: 35,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1D4ED8',
    marginLeft: 16,
  },
  card: {
    backgroundColor: '#E0E7FF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  dateText: {
    fontSize: 18,
    color: '#1E293B',
    textAlign: 'center',
    marginVertical: 20,
  },
  confirmButton: {
    backgroundColor: '#1D4ED8',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
