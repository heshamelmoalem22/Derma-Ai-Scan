
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";
import { Linking } from 'react-native';

const ResultScreen = () => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [fullName, setFullName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [diagnosisId, setDiagnosisId] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  
useEffect(() => {
  (async () => {
    const savedImage = await AsyncStorage.getItem('profileImage');
    if (savedImage) setProfileImage(savedImage);
  })();
}, []);
//  useEffect(() => {
//     (async () => {
//       const savedToken = await AsyncStorage.getItem('token');
//       const savedFullName = await AsyncStorage.getItem('fullName');

//       if (!savedToken) {
//         Alert.alert('Auth Error', 'Please log in again.');
//         return;
//       }

//       setToken(savedToken);
//       if (savedFullName) setFullName(savedFullName);

//       const storedData = await AsyncStorage.getItem(`results_${savedToken}`);
//       if (storedData) {
//         const parsed = JSON.parse(storedData);
//         setDiagnosis(parsed.diagnosis);
//         setImageUri(parsed.imageUri);
//          setDiagnosisId(parsed.diagnosisId);

        
//         // try {
//         //   const response = await fetch(
//         //     'https://backendscan-production.up.railway.app/api/patient/diagnosis',
//         //     {
//         //       method: 'POST',
//         //       headers: {
//         //         'Content-Type': 'application/json',
//         //         Authorization: `Bearer ${savedToken}`,
//         //       },
//         //       body: JSON.stringify({
//         //         diagnosis: parsed.diagnosis,
//         //         imageUrl: parsed.imageUri
//         //       }),
//         //     }
//         //   );

//         //   const data = await response.json();
//         //   if (!response.ok) throw new Error(data.message || 'Failed to save diagnosis');
          
//         //   setDiagnosisId(data._id);
//         //   await AsyncStorage.setItem(
//         //     `results_${savedToken}`,
//         //     JSON.stringify({ ...parsed, diagnosisId: data._id })
//         //   );
//         // } catch (error) {
//         //   Alert.alert('Error', error.message);
//         // }
//       }

//       setLoading(false);
//     })();
//   }, []);
// Add to ResultScreen's useEffect
useEffect(() => {
  const loadResults = async () => {
   const [token, patientId, savedFullName] = await Promise.all([
  AsyncStorage.getItem('token'),
  AsyncStorage.getItem('patientId'),
  AsyncStorage.getItem('fullName')
]);

    if (!token || !patientId) {
      Alert.alert('Error', 'Session expired');
      router.push('/login');
      return;
    }
if (savedFullName) setFullName(savedFullName);
    const storedData = await AsyncStorage.getItem(`patient_${patientId}_results`);

    if (storedData) {
      const parsed = JSON.parse(storedData);
      setDiagnosis(parsed.diagnosis);
      setImageUri(parsed.imageUri);
      setDiagnosisId(parsed.diagnosisId);
          await AsyncStorage.multiSet([
        ['diagnosisId', parsed.diagnosisId],
        ['imageUri', parsed.imageUri],
        [`patient_${patientId}_results`, storedData] 
      ]);
    }

    setLoading(false);
  };

  loadResults();
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

  return (
    <View style={styles.container}>
      {showMenu && <Pressable style={styles.overlay} onPress={toggleMenu} />}

      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={37} color="#2563EB" />
        </TouchableOpacity>

        <View style={styles.profileInfo}>
           {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileCircle} />
          ) : (
            <View style={styles.profileCircle} />
          )}
          <Text style={styles.greeting}> {fullName}</Text>
        </View>

        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Skin Result</Text>

      <View style={styles.imageBox}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Ionicons name="image-outline" size={80} color="#aaa" />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.descriptionContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#3B82F6" />
        ) : (
            <>
      <Text style={styles.bulletPoint}>
        • THE Diagnosis is {diagnosis || "No diagnosis available."}
      </Text>
      <Text style={styles.bullet}>
        • Accuracy: {"75%" || "N/A"}
      </Text>
      <Text
  style={[styles.bullett, { color: '#3B82F6', textDecorationLine: 'underline' }]}
  onPress={() => Linking.openURL(`https://www.google.com/search?q=${encodeURIComponent(diagnosis)}`)}
>
  • Read About {diagnosis}?
</Text>
    </>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.detailButton}>
        <Text style={styles.buttonText}>details</Text>
      </TouchableOpacity>

  <TouchableOpacity 
  style={styles.sendButton}
  onPress={() =>
  router.push({
  pathname: "/doctors",
  params: {
    diagnosis: diagnosis,       
    diagnosisId: diagnosisId,   
    imageUri: imageUri          
  }
})
  }
>
  <Text style={styles.buttonText}>send to doctor</Text>
</TouchableOpacity>


      <TouchableOpacity onPress={() => router.push("/upload")}>
        <Text style={styles.retakeText}>Retake Photo</Text>
      </TouchableOpacity>

      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push("/upload")}>
          <Ionicons name="camera-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Ionicons name="person-outline" size={28} color="#fff" />
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
};

export default ResultScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfdfd',
    paddingTop: 47,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
    profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#3B82F6',
    marginRight: 8,
  },
   profile: {
    flexDirection: 'row',
    justifyContent:"flex-start",
    marginLeft:30,
    alignItems: 'center',
    marginBottom:20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginRight:200,
  },
   greeting: {
    fontSize: 22,
    color: '#333',
  },
  // profileImage: {
  //   width: 50,
  //   height: 50,
  //   borderRadius: 60,
  //   borderWidth: 2,
  //   borderColor: '#3B82F6',
  //   position: "absolute",
  //   // right: 104,
  // },
  // welcomeText: {
  //   fontSize: 22,
  //   color: '#333',
  // },
  // nameText: {
  //   marginRight: 80,
  //   position: "absolute",
  //   // right: 1,

  // },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#DDE5FF",
    color: "#3B82F6",
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  imageBox: {
    position: "absolute",
    top: 170,
    width: 180,
    height: 180,
    backgroundColor: "#E3EBFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 20,
  },
  descriptionContainer: {
    marginTop: 140,
    padding: 40,
  },
  bulletPoint: {
    color: "#3B82F6",
    marginBottom: 12,
    marginTop:25,
    marginLeft:15,
    fontSize: 20,
    lineHeight: 20,
    
  },
  bullet:{
      color: "#3B82F6",
    marginBottom: 15,
    marginTop:4,
    marginLeft:15,
    fontSize: 20,
    lineHeight: 20,
  },
  bullett:{
      color: "#3B82F6",
    marginBottom: 12,
    marginTop:4,
    marginLeft:15,
    fontSize: 20,
    lineHeight: 20,
  },
  detailButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    width: "60%",
    borderRadius: 25,
    alignItems: "center",
    position: "absolute",
    top: 530,
  },
  sendButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    width: "60%",
    borderRadius: 25,
    alignItems: "center",
    position: "absolute",
    top: 590,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  retakeText: {
    color: "#3B82F6",
    textDecorationLine: "underline",
    marginBottom: 20,
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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 1,
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
