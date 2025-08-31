import React, { useRef,useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  TouchableOpacity, 
  Image,
  ScrollView,
  Animated,
  Pressable,
  Appearance,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [fullName, setFullName] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
  (async () => {
    const savedName = await AsyncStorage.getItem('fullName');
    if (savedName) setFullName(savedName);
  })();
}, []);
  // Load user data and theme preference
  useEffect(() => {
    const loadUserData = async () => {
      const savedImage = await AsyncStorage.getItem('profileImage');
      const savedName = await AsyncStorage.getItem('userName');
      const savedTheme = await AsyncStorage.getItem('themePreference');
      
      if (savedImage) setProfileImage(savedImage);
      if (savedName) setUserName(savedName);
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
      } else {
        // Use system preference if no saved theme
        const colorScheme = Appearance.getColorScheme();
        setIsDarkMode(colorScheme === 'dark');
      }
    };

    loadUserData();
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

  
  useEffect(() => {
    AsyncStorage.setItem('themePreference', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

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
            
            
            router.replace('/login');
          },
          style: 'destructive',
        },
      ]
    );
  };

 
  const themeStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#fff',
      paddingHorizontal: 16,
      paddingTop: 50,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 30,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#1D4ED8',
      marginLeft: 16,
    },
    profileSection: {
      alignItems: 'center',
      marginBottom: 30,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 16,
    //   borderWidth: 2,
    //   borderColor: isDarkMode ? '#BB86FC' : '#1D4ED8',
    },
    userName: {
      fontSize: 22,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#1E293B',
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#BB86FC' : '#1D4ED8',
      marginBottom: 16,
      marginTop: 10,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333333' : '#E2E8F0',
    },
    settingText: {
      fontSize: 16,
      color: isDarkMode ? '#E0E0E0' : '#334155',
    },
    logoutButton: {
      backgroundColor: isDarkMode ? '#CF6679' : '#FECACA',
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 30,
    },
    logoutText: {
      color: isDarkMode ? '#FFFFFF' : '#B91C1C',
      fontSize: 16,
      fontWeight: 'bold',
    },
    navbar: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      paddingVertical: 12,
      backgroundColor: isDarkMode ? '#1F1F1F' : '#3B82F6',
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginLeft: 17.5,
    },
  });

  return (
    <View style={themeStyles.container}>
      {showMenu && <Pressable style={styles.overlay} onPress={toggleMenu} />}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={themeStyles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons 
              name="chevron-back" 
              size={32} 
              color={isDarkMode ? '#BB86FC' : '#1D4ED8'} 
            />
          </TouchableOpacity>
          <Text style={themeStyles.headerTitle}>Settings</Text>
        </View>

        {/* Profile Section */}
        <View style={themeStyles.profileSection}>
          {profileImage ? (
            <Image 
              source={{ uri: profileImage }} 
              style={themeStyles.profileImage} 
            />
          ) : (
            <View style={[themeStyles.profileImage, { backgroundColor: '#CBD5E1' }]} />
          )}
          <Text style={themeStyles.userName}>{fullName}</Text>
        </View>

        
       

        {/* Account Settings */}
        <Text style={themeStyles.sectionTitle}>Account</Text>
        <TouchableOpacity style={themeStyles.settingItem}onPress={() => router.push('/EditProfileScreen')}>
          <Text style={themeStyles.settingText}>Edit Your Name</Text>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={isDarkMode ? '#BB86FC' : '#1D4ED8'} 
          />
        </TouchableOpacity>
        <TouchableOpacity style={themeStyles.settingItem}onPress={() => router.push('/ChangePasswordScreen')}>
          <Text style={themeStyles.settingText}>Change Password</Text>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={isDarkMode ? '#BB86FC' : '#1D4ED8'} 
          />
        </TouchableOpacity>
        <TouchableOpacity style={themeStyles.settingItem}onPress={() => router.push('/NotificationSettingsScreen')}>
          <Text style={themeStyles.settingText}>Notification Settings</Text>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={isDarkMode ? '#BB86FC' : '#1D4ED8'} 
          />
        </TouchableOpacity>

        {/* Support */}
        <Text style={themeStyles.sectionTitle}>Support</Text>
        <TouchableOpacity style={themeStyles.settingItem}onPress={() => router.push('/HelpCenterScreen')}>
          <Text style={themeStyles.settingText}>Help Center</Text>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={isDarkMode ? '#BB86FC' : '#1D4ED8'} 
          />
        </TouchableOpacity>
        <TouchableOpacity style={themeStyles.settingItem}onPress={() => router.push('/ContactUsScreen')}>
          <Text style={themeStyles.settingText}>Contact Us</Text>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={isDarkMode ? '#BB86FC' : '#1D4ED8'} 
          />
        </TouchableOpacity>
        <TouchableOpacity style={themeStyles.settingItem}onPress={() => router.push('/PrivacyPolicyScreen')}>
          <Text style={themeStyles.settingText}>Privacy Policy</Text>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={isDarkMode ? '#BB86FC' : '#1D4ED8'} 
          />
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity 
          style={themeStyles.logoutButton} 
          onPress={handleLogout}
        >
          <Text style={themeStyles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={themeStyles.navbar}>
        <TouchableOpacity onPress={() => router.push('/dashboard')}>
          <Ionicons 
            name="home-outline" 
            size={28} 
            color={isDarkMode ? '#BB86FC' : 'white'} 
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Ionicons 
            name="person-outline" 
            size={28} 
            color={isDarkMode ? '#BB86FC' : 'white'} 
          />
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

export default SettingsScreen;
const styles = StyleSheet.create({
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
    marginLeft:80,
  },
});
// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';

// const EditProfileScreen = () => {
//   const router = useRouter();
//   const [name, setName] = useState('');

//   useEffect(() => {
//     (async () => {
//       const savedName = await AsyncStorage.getItem('fullName');
//       if (savedName) setName(savedName);
//     })();
//   }, []);

//   const handleSave = async () => {
//     await AsyncStorage.setItem('fullName', name);
//     alert('Profile updated!');
//     router.back();
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={() => router.back()}>
//         <Ionicons name="chevron-back" size={28} color="#1D4ED8" />
//       </TouchableOpacity>
//       <Text style={styles.title}>Edit Profile</Text>
//       <TextInput 
//         style={styles.input}
//         value={name}
//         onChangeText={setName}
//         placeholder="Full Name"
//       />
//       <Button title="Save" color="#1D4ED8" onPress={handleSave} />
//     </View>
//   );
// };

// export default EditProfileScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#fff' },
//   title: { fontSize: 24, fontWeight: 'bold', marginVertical: 20, color: '#1D4ED8' },
//   input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 20 }
// });
// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';

// const ChangePasswordScreen = () => {
//   const router = useRouter();
//   const [password, setPassword] = useState('');
//   const [confirm, setConfirm] = useState('');

//   const handleChange = () => {
//     if (password !== confirm) {
//       alert('Passwords do not match');
//       return;
//     }
//     alert('Password changed successfully');
//     router.back();
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={() => router.back()}>
//         <Ionicons name="chevron-back" size={28} color="#1D4ED8" />
//       </TouchableOpacity>
//       <Text style={styles.title}>Change Password</Text>
//       <TextInput secureTextEntry style={styles.input} placeholder="New Password" onChangeText={setPassword} />
//       <TextInput secureTextEntry style={styles.input} placeholder="Confirm Password" onChangeText={setConfirm} />
//       <Button title="Change Password" onPress={handleChange} color="#1D4ED8" />
//     </View>
//   );
// };

// export default ChangePasswordScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#fff' },
//   title: { fontSize: 24, fontWeight: 'bold', marginVertical: 20, color: '#1D4ED8' },
//   input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 20 }
// });
// import React, { useState } from 'react';
// import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';

// const NotificationSettingsScreen = () => {
//   const router = useRouter();
//   const [notifications, setNotifications] = useState(true);

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={() => router.back()}>
//         <Ionicons name="chevron-back" size={28} color="#1D4ED8" />
//       </TouchableOpacity>
//       <Text style={styles.title}>Notification Settings</Text>
//       <View style={styles.setting}>
//         <Text style={styles.label}>Enable Notifications</Text>
//         <Switch value={notifications} onValueChange={setNotifications} />
//       </View>
//     </View>
//   );
// };

// export default NotificationSettingsScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#fff' },
//   title: { fontSize: 24, fontWeight: 'bold', marginVertical: 20, color: '#1D4ED8' },
//   setting: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
//   label: { fontSize: 16 }
// });
// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';

// const HelpCenterScreen = () => {
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={() => router.back()}>
//         <Ionicons name="chevron-back" size={28} color="#1D4ED8" />
//       </TouchableOpacity>
//       <Text style={styles.title}>Help Center</Text>
//       <Text style={styles.text}>
//         For help with the app, visit our FAQ section or contact support.
//       </Text>
//     </View>
//   );
// };

// export default HelpCenterScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#fff' },
//   title: { fontSize: 24, fontWeight: 'bold', marginVertical: 20, color: '#1D4ED8' },
//   text: { fontSize: 16, lineHeight: 24 }
// });
// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';

// const ContactUsScreen = () => {
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={() => router.back()}>
//         <Ionicons name="chevron-back" size={28} color="#1D4ED8" />
//       </TouchableOpacity>
//       <Text style={styles.title}>Contact Us</Text>
//       <Text style={styles.text}>Email: support@example.com</Text>
//       <Text style={styles.text}>Phone: +123 456 7890</Text>
//     </View>
//   );
// };

// export default ContactUsScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#fff' },
//   title: { fontSize: 24, fontWeight: 'bold', marginVertical: 20, color: '#1D4ED8' },
//   text: { fontSize: 16, marginBottom: 10 }
// });
// import React from 'react';
// import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';

// const PrivacyPolicyScreen = () => {
//   const router = useRouter();

//   return (
//     <ScrollView style={styles.container}>
//       <TouchableOpacity onPress={() => router.back()}>
//         <Ionicons name="chevron-back" size={28} color="#1D4ED8" />
//       </TouchableOpacity>
//       <Text style={styles.title}>Privacy Policy</Text>
//       <Text style={styles.text}>
//         We respect your privacy. Your data will not be shared without your consent...
//       </Text>
//     </ScrollView>
//   );
// };

// export default PrivacyPolicyScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#fff' },
//   title: { fontSize: 24, fontWeight: 'bold', marginVertical: 20, color: '#1D4ED8' },
//   text: { fontSize: 16, lineHeight: 24 }
// });

