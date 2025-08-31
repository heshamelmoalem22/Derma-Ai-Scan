import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';



const PaymentConfirmScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handlePayment = async () => {
  setIsProcessing(true);


  setTimeout(() => {
    setIsProcessing(false);
    router.push({
      pathname: '/success',
      params
    });
  }, 1500);
};


  return (
    <View style={styles.container}>
      <View style={styles.header}>
          <Ionicons name="chevron-back" size={37} color="#1e5eff" onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Confirm Payment</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Doctor:</Text>
          <Text style={styles.value}>{params.doctorName || 'Dr. Olivia Turner, M.D.'}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Date & Time:</Text>
          <Text style={styles.value}>{params.date} at {params.time}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Duration:</Text>
          <Text style={styles.value}>30 Minutes</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.row}>
          <Text style={styles.label}>Total:</Text>
          <Text style={styles.total}>${params.amount || '100.00'}</Text>
        </View>
        
        <View style={styles.paymentMethod}>
          <Ionicons name="card-outline" size={24} color="#1D4ED8" />
          <Text style={styles.methodText}>Card ending in 4242</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.payButton} 
        onPress={handlePayment}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.payButtonText}>Pay Now</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop:18,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#64748B',
  },
  value: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  total: {
    fontSize: 18,
    color: '#1E293B',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  methodText: {
    fontSize: 16,
    color: '#1E293B',
  },
  payButton: {
    backgroundColor: '#1D4ED8',
    borderRadius: 30,
    padding: 18,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 24,
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentConfirmScreen;