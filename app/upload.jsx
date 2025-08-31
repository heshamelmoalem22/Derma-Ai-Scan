import React, {useRef, useState, useEffect } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,Animated,
  Pressable
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function UploadComponent() {
  const [image, setImage] = useState(null);
  const [token, setToken] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
     const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
  (async () => {
    const savedImage = await AsyncStorage.getItem('profileImage');
    if (savedImage) setProfileImage(savedImage);
  })();
}, []);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera access is needed.');
      }

      const savedToken = await AsyncStorage.getItem('token');
      const savedFullName = await AsyncStorage.getItem('fullName');

      if (!savedToken) {
        Alert.alert('Auth Error', 'Please log in again.');
      } else {
        setToken(savedToken);
      }

      if (savedFullName) {
        setFullName(savedFullName);
      }
    })();
  }, []);
  const toggleMenu = () => {
        if (showMenu) {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => setShowMenu(false));
        } else {
          setShowMenu(true);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

const uploadImage = async () => {
  if (!image) {
    Alert.alert('No Image', 'Please select or take a photo');
    return;
  }
  if (!token) {
    Alert.alert('Missing token', 'You must be logged in.');
    return;
  }

  try {
    setUploading(true);

    const uriParts = image.split('/');
    const fileName = uriParts[uriParts.length - 1];
    const fileTypeMatch = /\.(\w+)$/.exec(fileName);
    const fileType = fileTypeMatch ? `image/${fileTypeMatch[1]}` : `image/jpeg`;

    const formData = new FormData();
    formData.append('image', {
      uri: image,
      name: fileName,
      type: fileType,
    });

    const response = await fetch('https://backendscan-production.up.railway.app/api/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Diagnosis failed');
    }

    const patientId = await AsyncStorage.getItem('patientId');
    const diagnosisData = {
      imageUri: image,
      diagnosis: data.diagnosis.result,
      diagnosisId: data.diagnosis._id,
      createdAt: new Date().toISOString()
    };


    if (!patientId) {
      throw new Error('Missing patient ID');
    }

  await AsyncStorage.setItem(
  `patient_${patientId}_results`,
  JSON.stringify({
    imageUri: image,
    diagnosis: data.diagnosis.result,
    diagnosisId: data.diagnosis._id,
    createdAt: new Date().toISOString()
  })
);


  await AsyncStorage.multiSet([
      [`patient_${patientId}_results`, JSON.stringify(diagnosisData)],
      ['diagnosisId', data.diagnosis._id],
      ['imageUri', image]
    ]);

    router.push('/result');
  } catch (error) {
    Alert.alert('Upload Failed', error.message);
  } finally {
    setUploading(false);
  }
};

  return (
    <View style={styles.container}>
      {showMenu && <Pressable style={styles.overlay} onPress={toggleMenu} />}
      <View style={styles.headerRow}>
        <Ionicons name="chevron-back" size={37} color="#1e5eff" onPress={() => router.back()} />
        <View style={styles.profile}>
          <View style={styles.profileRow}>
                             {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileCircle} />
            ) : (
              <View style={styles.profileCircle} />
            )}
            <Text style={styles.greeting}> {fullName}</Text>
          </View>
        </View>
        <Ionicons style={{ marginLeft: -20 }}name="settings-outline" size={24} color="#1e5eff" onPress={()=>router.push('/settings')} />
      </View>

      <Text style={styles.header}>Upload photos</Text>

      <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Ionicons name="cloud-upload-outline" size={60} color="#555" />
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
        <Text style={styles.buttonText}> Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
        <Text style={styles.buttonText}>Take Photo</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/result")}>
        <Text style={styles.buttonText}>route</Text>
      </TouchableOpacity> */}

      {image && (
        <View style={styles.uploadDeleteRow}>
          <TouchableOpacity style={styles.uploadDeleteButton} onPress={uploadImage}>
            <Text style={styles.uploadDeleteText}>Upload</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.uploadDeleteButton, { backgroundColor: '#ef4444' }]}
            onPress={() => setImage(null)}
          >
            <Text style={styles.uploadDeleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      {uploading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
{/* </View> */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push("/dashboard")}>
          <Ionicons name="home-outline" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Ionicons name="person-outline" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleMenu}>
                          <Ionicons name="ellipsis-horizontal" size={28} color="#fff" />
                        </TouchableOpacity>
      </View>
      {showMenu && (
                    <Animated.View
                      style={[
                        styles.modalContainer,
                        {
                          opacity: fadeAnim,
                          transform: [
                            {
                              translateY: fadeAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [40, 0],
                              }),
                            },
                          ],
                        },
                      ]}
                    >
                      <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push("/doctors")}
                      >
                        <Text style={styles.menuText}>See Doctors</Text>
                      </TouchableOpacity>
                      <View style={styles.divider} />
                      <TouchableOpacity style={styles.menuItem}onPress={() => router.push("/AiDisclaimerScreen")}>
                        <Text style={styles.menuText}>More Advice</Text>
                      </TouchableOpacity>
                      <View style={styles.divider} />
                      <TouchableOpacity style={styles.menuItem}onPress={() => router.push("/AccuracyTechScreen")}>
                        <Text style={styles.menuText}>Accuracy Tech</Text>
                      </TouchableOpacity>
                    </Animated.View>
                  )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  setting: {
    // marginLeft:1,
    // marginRight:120,
  },
  profile: {
    flexDirection: 'row',
    marginRight: 220,
    alignItems: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#3B82F6',
    marginRight: 8,
  },
  greeting: {
    fontSize: 22,
    color: '#333',
  },
  header: {
       fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#DDE5FF",
    color: "#3B82F6",
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
    marginTop:15,
  },
  uploadBox: {
    width: 180,
    height: 180,
    backgroundColor: '#e0ecff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    marginTop:20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    // marginVertical:20,
    marginTop:25,
    width: '50%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  uploadDeleteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '80%',
  },
  uploadDeleteButton: {
    flex: 1,
    backgroundColor: '#10b981',
    paddingVertical: 12,
    marginHorizontal: 5,
    marginTop:30,
    borderRadius: 25,
    alignItems: 'center',
  },
  uploadDeleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'rgba(0,0,0,0.4)',
    
    justifyContent:'center',
    alignItems: 'center',
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
  },
   modalContainer: {
    position: "absolute",
    bottom: 60,
    right: 20,
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 10,
    zIndex: 2,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  menuText: {
    fontSize: 14,
    color: "#3B82F6",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 4,
  },
});
