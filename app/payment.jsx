import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const PaymentScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedMethod, setSelectedMethod] = useState(null);
  
  const paymentMethods = [
    { id: 'card', name: 'Credit & Debit Card', icon: 'card-outline' },
    { id: 'applepay', name: 'Apple Pay', icon: 'logo-apple' },
    { id: 'paypal', name: 'PayPal', icon: 'logo-paypal' },
    { id: 'googlepay', name: 'Google Pay', icon: 'logo-google' },
  ];

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    if (method.id === 'card') {
      router.push({
        pathname: '/add-card',
        params
      });
    } else {
      router.push({
        pathname: '/confirm',
        params: { ...params, paymentMethod: method.id }
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
          
        <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={37} color="#1e5eff" onPress={() => router.back()} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Method</Text>
        <View style={{ width: 28 }} />
      </View>

      <Text style={styles.sectionTitle}>Credit & Debit Card</Text>
      <TouchableOpacity 
        style={styles.methodCard} 
        onPress={() => handleSelectMethod(paymentMethods[0])}
      >
        <View style={styles.methodInfo}>
          <Ionicons name="card-outline" size={24} color="#1D4ED8" />
          <Text style={styles.methodName}>Add New Card</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#64748B" />
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>More Payment Options</Text>
      {paymentMethods.slice(1).map((method) => (
        <TouchableOpacity
          key={method.id}
          style={styles.methodCard}
          onPress={() => handleSelectMethod(method)}
        >
          <View style={styles.methodInfo}>
            <Ionicons name={method.icon} size={24} color="#1D4ED8" />
            <Text style={styles.methodName}>{method.name}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#64748B" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    flexGrow: 1,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginTop: 16,
    marginBottom: 12,
  },
  methodCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  methodName: {
    fontSize: 16,
    color: '#1E293B',
  },
});

export default PaymentScreen;