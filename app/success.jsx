import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const PaymentSuccessScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={37} color="#fff" onPress={() => router.back()} />
                </TouchableOpacity>
      <View style={styles.content}>
          <Image source={require("../assets/result.png")} style={styles.successImage} />
        
          
       
        <Text style={styles.title}>Congratulations</Text>
        <Text style={styles.subtitle}>Payment is Successfully</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.message}>
          You have successfully booked an appointment with
        </Text>
        <Text style={styles.doctorName}>{params.doctorName || 'Dr. Olivia Turner, M.D.'}</Text>
        
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{params.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time:</Text>
            <Text style={styles.detailValue}>{params.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount:</Text>
            <Text style={styles.detailValue}>${params.amount || '100.00'}</Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.doneButton}
        onPress={() => router.replace('/dashboard')}
      >
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#1367F2',
    justifyContent: 'space-between',
  },
  content: {
    alignItems: 'center',
    marginTop: 40,
  },
  successImage: {
    width: 120, 
    height: 120,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 32,
  },
  divider: {
    height: 1,
    backgroundColor: '#fff',
    width: '80%',
    marginVertical: 24,
  },
  message: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 32,
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 16,
    color: '#64748B',
  },
  detailValue: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  doneButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 18,
    alignItems: 'center',
    marginBottom: 24,
    marginLeft:90,
    width: '50%',
  },
  doneButtonText: {
    color: '#1367F2',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentSuccessScreen;