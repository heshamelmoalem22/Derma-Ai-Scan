import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const AiDisclaimerScreen = () => {
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
        <Text style={styles.title}>AI Disclaimer</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.paragraph}>
          Artificial Intelligence (AI) has become an innovative tool in the healthcare field,
          offering support in early detection and medical guidance. However, it's important to
          understand that the results and suggestions provided by this application are generated
          through machine learning algorithms and not by a certified medical professional.{"\n\n"}
          The AI system analyzes input data to offer insights based on patterns from a trained
          model. It does not possess human judgment, clinical experience, or the ability to perform
          a physical examination.{"\n\n"}
          Therefore, any diagnosis or advice displayed in this application should be considered
          informational only and not a confirmed medical opinion.{"\n\n"}
          Users are strongly advised to consult a licensed physician or healthcare provider before
          making decisions about their health.{"\n\n"}
          This application should not be used to self-diagnose, treat, or prevent any medical
          condition.{"\n\n"}
          Relying solely on AI without professional oversight could lead to incorrect treatment or
          overlooked health risks.{"\n\n"}
          The information presented may be incomplete or inaccurate depending on the input data.{"\n\n"}
          AI can assist doctors but it cannot replace them. Human expertise is essential in
          assessing symptoms holistically.{"\n\n"}
          Medical decisions should always be guided by qualified professionals who understand your
          full medical history.{"\n\n"}
          In emergency situations, do not depend on this application — seek immediate medical
          attention.{"\n\n"}
          By using this feature, you agree to use AI as a supplementary tool, not a definitive
          solution.{"\n\n"}
          Your health and safety are always the top priority. Use technology wisely and responsibly.{"\n\n"}
          The app's creators and developers are not liable for misuse of AI results or delays in
          professional care.{"\n\n"}
          Trust technology, but more importantly, trust your doctor.{"\n\n"}
          We believe in empowering users — not replacing healthcare providers.{"\n\n"}
          Use the AI feature to gain awareness, not to diagnose or prescribe.{"\n\n"}
          Combine AI insights with clinical expertise for the best outcome.{"\n\n"}
          Always choose professional care when in doubt.{"\n\n"}
          This AI feature is a helpful assistant — not your doctor.
        </Text>
      </ScrollView>
    </View>
  );
};

export default AiDisclaimerScreen;

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