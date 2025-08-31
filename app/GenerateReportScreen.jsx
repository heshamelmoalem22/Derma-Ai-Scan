import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GenerateReportScreen() {
  const [reportText, setReportText] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { diagnosis, diagnosisId, imageUrl } = useLocalSearchParams();

  const validateInputs = () => {
    if (!reportText.trim()) {
      Alert.alert('Validation Error', 'Medical findings cannot be empty');
      return false;
    }
    if (!diagnosisId) {
      Alert.alert('Validation Error', 'Diagnosis ID is missing');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem('doctorToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(
        'https://backendscan-production.up.railway.app/api/doctor/reports/create-report',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            diagnosisId,
            doctorNotes: doctorNotes || '', 
            reportText,
          }),
        }
      );

      const responseText = await response.text();
      if (responseText.startsWith('<!DOCTYPE html>')) {
        throw new Error('Server returned an HTML error page');
      }

      const data = JSON.parse(responseText);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create report');
      }

      console.log('Report created successfully:', data);
      Alert.alert(
        'Success', 
        data.message || 'PDF report generated and sent successfully',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Report submission error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to submit report. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
     
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medical Report</Text>
      </View>

      
      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.diagnosisImage} />
      )}
      <View style={styles.diagnosisInfo}>
        <Text style={styles.diagnosisLabel}>Diagnosis:</Text>
        <Text style={styles.diagnosisText}>{diagnosis}</Text>
        <Text style={styles.diagnosisId}>ID: {diagnosisId}</Text>
      </View>

     
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medical Findings*</Text>
        <TextInput
          style={styles.textInput}
          multiline
          placeholder="Enter detailed medical findings..."
          value={reportText}
          onChangeText={setReportText}
          editable={!isLoading}
        />
      </View>

      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Clinical Notes</Text>
        <TextInput
          style={[styles.textInput, { minHeight: 120 }]}
          multiline
          placeholder="Additional observations and recommendations..."
          value={doctorNotes}
          onChangeText={setDoctorNotes}
          editable={!isLoading}
        />
      </View>

     
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            isLoading && styles.disabledButton,
            !reportText.trim() && styles.disabledButton
          ]}
          onPress={handleSubmit}
          disabled={isLoading || !reportText.trim()}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Generate PDF Report</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#f8f9fa',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1e88e5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
    elevation: 3,
  },
  backButton: {
    color: '#fff',
    fontSize: 24,
    marginRight: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  diagnosisImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#e0e0e0',
  },
  diagnosisInfo: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1,
  },
  diagnosisLabel: {
    fontWeight: '600',
    color: '#424242',
    marginBottom: 4,
  },
  diagnosisText: {
    fontSize: 16,
    color: '#212121',
    marginBottom: 8,
  },
  diagnosisId: {
    fontSize: 14,
    color: '#757575',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    minHeight: 150,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  submitButton: {
    backgroundColor: '#1e88e5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bdbdbd',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButtonText: {
    color: '#616161',
    fontWeight: '600',
    fontSize: 16,
  },
});