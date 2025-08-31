import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const AccuracyTechScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={32} color="#1e5eff" />
        </TouchableOpacity>
        <Text style={styles.title}>Accuracy of Technology</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.paragraph}>
          The AI system used in this application is built on advanced deep learning and image
          recognition technologies. It is trained using thousands of labeled medical images and
          clinical data to recognize visual patterns related to common skin conditions.{"\n\n"}
          The model has undergone multiple evaluation stages to ensure high levels of precision,
          recall, and overall diagnostic accuracy.{"\n\n"}
          During development, it was tested against medical datasets validated by expert
          dermatologists.{"\n\n"}
          Accuracy improves over time as the system is updated with new data and learning
          iterations.{"\n\n"}
          However, even the most accurate AI model has limitations when dealing with rare,
          ambiguous, or poorly captured images.{"\n\n"}
          This technology works best under optimal lighting and clear image quality conditions.{"\n\n"}
          The confidence level shown in results is based on how closely the image matches known
          patterns.{"\n\n"}
          We use ensemble methods and error checking to reduce false positives and negatives.{"\n\n"}
          Despite its robustness, the system cannot interpret patient history, symptoms, or
          behavior.{"\n\n"}
          It also cannot replicate the clinical judgment or intuition of a trained doctor.{"\n\n"}
          The accuracy rate may vary slightly between different skin tones, image angles, and
          lighting conditions.{"\n\n"}
          We are constantly working to improve fairness, inclusivity, and performance across all
          demographics.{"\n\n"}
          The technology is reviewed regularly by our AI and medical teams.{"\n\n"}
          Our mission is to make accurate diagnostics accessible, not to replace medical visits.{"\n\n"}
          Technology helps accelerate initial awareness — the doctor ensures the right treatment.{"\n\n"}
          Every result is calculated through a multi-layered neural network and compared to known
          cases.{"\n\n"}
          The more images the system sees, the better its pattern recognition becomes.{"\n\n"}
          Accuracy is a product of both science and responsible design.{"\n\n"}
          Trust in the tech, but always verify with a healthcare professional.
        </Text>
      </ScrollView>
    </View>
  );
};

export default AccuracyTechScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 10,
    backgroundColor: '#F0F7FF',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#2563EB',
    textAlign: 'left',
  },
  content: {
    paddingBottom: 30,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
});