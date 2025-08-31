import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get("window").width;

const images = [
  {
    source: require("../assets/images.jpeg"),
    caption: "AI-powered detection",
  },

  {
    source: require("../assets/Skin-Diseases.webp"),
    caption: "DermAiScan in action",
  },
  {
    source: require("../assets/images (3).jpeg"),
    caption: "Identify skin conditions",
  },
  {
    source: require("../assets/skin-allergy-person-s-arm_23-2149140509-1-1-2-1-1-1.jpg"),
    caption: "Smarter skin care",
  },
    {
    source: require("../assets/images (2).jpeg"),
    caption: "Accurate skin analysis",
  },
];

const DashboardScreen = () => {
  const router = useRouter();
  const { fullName: routeFullName } = useLocalSearchParams();
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
   const [fullName, setFullName] = useState('');
   const [token, setToken] = useState(null);
   const [showMenu, setShowMenu] = useState(false);
   const [profileImage, setProfileImage] = useState(null);
  //  const [userId, setUserId] = useState(null);
   const fadeAnim = useRef(new Animated.Value(0)).current;
  
useEffect(() => {
  (async () => {
    const savedImage = await AsyncStorage.getItem('profileImage');
    if (savedImage) setProfileImage(savedImage);
  })();
}, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      setCurrentIndex(nextIndex);
      scrollRef.current?.scrollTo({
        x: nextIndex * screenWidth,
        animated: true,
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);


  useEffect(() => {
    (async () => {
   const savedToken = await AsyncStorage.getItem('token');
      if (!savedToken) {
        Alert.alert('Auth Error', 'Please log in again.');
        return;
      }
      setToken(savedToken);
  
      if (routeFullName) {
        setFullName(routeFullName);
      } else {
        const savedFullName = await AsyncStorage.getItem('fullName');
        if (savedFullName) {
          setFullName(savedFullName);
        }
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

  return (
    <View style={styles.container}>
      {showMenu && <Pressable style={styles.overlay} onPress={toggleMenu} />}
       <View style={styles.profile}>
                <View style={styles.profileRow}>
                  {profileImage ? (
  <Image source={{ uri: profileImage }} style={styles.profileCircle} />
) : (
  <View style={styles.profileCircle} />
)}
                  <Text style={styles.greeting}>Hi,{fullName}</Text>
       <TouchableOpacity onPress={() => router.push("/NotificationsScreen")}>
    <Ionicons name="notifications-outline" size={26} color="#3B82F6" style={{ marginLeft: 210 }} />
  </TouchableOpacity>
                </View>
              </View>

      <Text style={styles.bannerTitle}>DermAiScan: AI for Skin Diagnosis</Text>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.banner}
        scrollEnabled={false} 
      >
        {images.map((item, index) => (
          <View key={index} style={styles.bannerItem}>
            <Image source={item.source} style={styles.image} />
            <Text style={styles.caption}>{item.caption}</Text>
          </View>
        ))}
      </ScrollView>

     <TouchableOpacity
  
  style={styles.uploadButton}
>
  <Ionicons name="camera-outline" size={28} color="#fff" onPress={() => router.push("/upload")}/>
 
</TouchableOpacity>


      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push("/upload")}>
          <Ionicons name="camera-outline" size={28} color="#fff" />
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  // title: {
  //   fontSize: 24,
  //   color: "#007BFF",
  //   textAlign: "center",
  //   marginBottom: 10,
  //   marginTop:10,
  // },
  bannerTitle: {
      fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#DDE5FF",
    color: "#3B82F6",
    paddingHorizontal: 39,
    paddingVertical: 10,
    borderRadius: 1,
    marginBottom: 15,
    marginTop: 20,
    
    
    
  },
  banner: {
    height: 200,
  },
  bannerItem: {
    width: screenWidth,
    alignItems: "center",
    justifyContent:"flex-start",
    marginTop:20,
    
  },
  image: {
    width: screenWidth * 0.9,
    height: 330,
    borderRadius: 20,
    resizeMode: "cover",
  },
  caption: {
    marginTop: 8,
    fontSize: 20,
    // color: "#fff",
  },
    profile: {
    flexDirection: 'row',
    justifyContent:"flex-start",
    marginLeft:30,
    alignItems: 'center',
    marginBottom:20,
  },
   overlay: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'rgba(0,0,0,0.4)',
    
    justifyContent:'center',
    alignItems: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadButton: {
  backgroundColor: "#3B82F6",
  paddingVertical: 14,
  paddingHorizontal: 60,
  borderRadius: 30,
  alignSelf: "center",
  marginBottom:70,
  // marginTop: 10,
  elevation: 2,
},
uploadButtonText: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "600",
},

  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#3B82F6',
    marginRight: 10,
  },
  greeting: {
    fontSize: 22,
    color: '#333',
  },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    justifyContent: "center",
  },
  uploadText: {
    marginLeft: 8,
    color: "#2563EB",
    fontSize: 16,
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

export default DashboardScreen;
