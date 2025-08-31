import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const [profileImage, setProfileImage] = useState(null);
  const [fullName, setFullName] = useState('');
  useEffect(() => {
  (async () => {
    const savedName = await AsyncStorage.getItem('fullName');
    if (savedName) setFullName(savedName);
    const [userId, setUserId] = useState(null);
  })();
}, []);

  useEffect(() => {
    const loadImage = async () => {
      const savedImage = await AsyncStorage.getItem('profileImage');
      if (savedImage) setProfileImage(savedImage);
    };
    loadImage();
  }, []);
   const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            
            await AsyncStorage.multiRemove([
              'token', 
              'role', 
              'patientUserId', 
              'profileImage',
              'userName'
            ]);
            
            
            router.replace('/SplashScreen');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need access to your gallery.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      setProfileImage(selectedUri);
      await AsyncStorage.setItem('profileImage', selectedUri);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      {/* <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={32} color="#2563EB" />
      </TouchableOpacity> */}

      <Text style={styles.title}>My Profile</Text>

     
      <View style={styles.profileContainer}>
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require('../assets/default-avatar.avif')
          }
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
          <Ionicons name="create-outline" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.name}>{fullName}</Text>

     
      <View style={styles.menuItem}>
        <Ionicons name="settings-outline" size={22} color="#1e5eff"  onPress={() => router.push('/settings')} />
        <Text style={styles.menuText}>Settings</Text>
        <Ionicons name="chevron-forward-outline" size={20} color="#888" />
      </View>
      <View style={styles.menuItem}>
        <Ionicons name="log-out-outline" size={22} color="#1e5eff"onPress={handleLogout} />
        <Text style={styles.menuText}>Logout</Text>
        <Ionicons name="chevron-forward-outline" size={20} color="#888" />
      </View>

     
      <View style={styles.navbar}>
        <Ionicons name="home-outline" size={24} color="#fff" onPress={() => router.push("/dashboard")}/>
        <Ionicons name="person" size={24} color="#fff" />
        <Ionicons name="document-text-outline" size={24} color="#fff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  backIcon: {
    position: 'absolute',
    top: 50,
    left: 25,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1e5eff',
    marginBottom: 20,
    marginRight:220,
  },
  profileContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 16,
      marginTop:15,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1e5eff',
    borderRadius: 12,
    padding: 4,
  },
  name: {
    fontSize: 22,
      fontWeight: 'bold',
    marginBottom: 30,
  },
  menuItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingHorizontal: 5,
    gap: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
   navbar: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      paddingVertical: 12,
      backgroundColor: '#3B82F6',
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginLeft: 12,
    },
});
