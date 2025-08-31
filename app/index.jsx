import { useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      router.replace("/SplashScreen"); 
    });
  }, []);

  return (
    <View style={styles.container}>
      
      <Image source={require("../assets/result.png")} style={styles.logo} />
      
      
      <Text style={styles.text}>Derm Ai Scan</Text>
      <Text style={styles.subText}>Dermatology Center</Text>

     
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1367F2", 
  },
  logo: {
    width: 120, 
    height: 120,
    marginBottom: 20,
    resizeMode: "contain",
  },
  text: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subText: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    marginBottom: 40, 
  },
  progressBarContainer: {
    width: "60%", 
    height: 6, 
    backgroundColor: "#ffffff55",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 3,
  },
});
