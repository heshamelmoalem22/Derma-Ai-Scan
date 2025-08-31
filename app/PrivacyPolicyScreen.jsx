import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PrivacyPolicyScreen = () => {
  const router = useRouter();

  return (
    <>
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
      <TouchableOpacity onPress={() => router.back()}style={styles.backButton}>
        <Ionicons name="chevron-back" size={37} color="#1D4ED8" />
      </TouchableOpacity>
      <Text style={styles.title}>Privacy Policy</Text>
      </View>
      <Text style={styles.text}>
        We respect your privacy. Your data will not be shared without your consent...
      </Text>
    </ScrollView>
       <View style={styles.navbar}>
            <TouchableOpacity onPress={() => router.push('/dashboard')}>
              <Ionicons name="home-outline" size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <Ionicons name="person-outline" size={28} color="white" />
            </TouchableOpacity>
           {/* <TouchableOpacity onPress={toggleMenu}>
                             <Ionicons name="ellipsis-horizontal" size={28} color="#fff" />
                           </TouchableOpacity> */}
          </View>
          </>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 20, color: '#1D4ED8' },
  text: { fontSize: 16, lineHeight: 24 },
   headerRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 50,
  marginBottom: 20,
},
backButton: {
  marginRight: 10,
},
 navbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#3B82F6",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    marginLeft: 2,
  },
});
