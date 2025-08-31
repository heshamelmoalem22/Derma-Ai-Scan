import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const AddCardScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const handleSubmit = () => {
    
    router.push({
      pathname: '/confirm',
      params: { ...params, paymentMethod: 'card' }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#1D4ED8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Card</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.cardPreview}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardLogo}>VISA</Text>
          <Ionicons name="card-outline" size={40} color="#1D4ED8" />
        </View>
        <Text style={styles.cardNumber}>•••• •••• •••• {cardDetails.number.slice(-4) || '0000'}</Text>
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.cardLabel}>Card Holder Name</Text>
            <Text style={styles.cardValue}>{cardDetails.name || 'John Doe'}</Text>
          </View>
          <View>
            <Text style={styles.cardLabel}>Expiry Date</Text>
            <Text style={styles.cardValue}>{cardDetails.expiry || '04/28'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          placeholder="0000 0000 0000 0000"
          keyboardType="number-pad"
          maxLength={16}
          value={cardDetails.number}
          onChangeText={(text) => setCardDetails({...cardDetails, number: text})}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Card Holder Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          value={cardDetails.name}
          onChangeText={(text) => setCardDetails({...cardDetails, name: text})}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 12 }]}>
          <Text style={styles.label}>Expiry Date</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/YY"
            maxLength={5}
            value={cardDetails.expiry}
            onChangeText={(text) => setCardDetails({...cardDetails, expiry: text})}
          />
        </View>
        <View style={[styles.formGroup, { flex: 1 }]}>
          <Text style={styles.label}>CVV</Text>
          <TextInput
            style={styles.input}
            placeholder="000"
            maxLength={3}
            secureTextEntry
            keyboardType="number-pad"
            value={cardDetails.cvv}
            onChangeText={(text) => setCardDetails({...cardDetails, cvv: text})}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.saveButtonText}>Save Card & Continue</Text>
      </TouchableOpacity>
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
  },
  cardPreview: {
    backgroundColor: '#1D4ED8',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardLogo: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardNumber: {
    color: 'white',
    fontSize: 22,
    letterSpacing: 2,
    marginBottom: 24,
    fontFamily: 'Courier',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  cardValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#1D4ED8',
    borderRadius: 30,
    padding: 18,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddCardScreen;