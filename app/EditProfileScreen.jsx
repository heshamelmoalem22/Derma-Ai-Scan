import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const EditProfileScreen = () => {
  const router = useRouter();
  const [name, setName] = useState('');

  useEffect(() => {
    (async () => {
      const savedName = await AsyncStorage.getItem('fullName');
      if (savedName) setName(savedName);
    })();
  }, []);

  const handleSave = async () => {
    await AsyncStorage.setItem('fullName', name);
    alert('Profile updated!');
    router.push('/dashboard');
  };

  return (
    <View style={styles.container}>
     <View style={styles.headerRow}>
  <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
    <Ionicons name="chevron-back" size={36} color="#1D4ED8" />
  </TouchableOpacity>
  <Text style={styles.title}>Edit Profile</Text>
</View>
      <TextInput 
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Full Name"
      />
      <Button title="Save" color="#1D4ED8" onPress={handleSave} />
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

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 10,marginLeft:5, color: '#1D4ED8' },
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