import React, { useState } from 'react';
 import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ChangePasswordScreen = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleChange = () => {
    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }
    alert('Password changed successfully');
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="chevron-back" size={36} color="#1D4ED8" />
                          </TouchableOpacity>
      <Text style={styles.title}>Change Password</Text>
      </View>
      <TextInput secureTextEntry style={styles.input} placeholder="New Password" onChangeText={setPassword} />
      <TextInput secureTextEntry style={styles.input} placeholder="Confirm Password" onChangeText={setConfirm} />
      <Button title="Change Password" onPress={handleChange} color="#1D4ED8" />
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
    </View>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 20, color: '#1D4ED8' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 20 },
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
    marginLeft: 20,
  },
});
