import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="SplashScreen" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="doctors" options={{ headerShown: false }} />
      <Stack.Screen name="doctorPage" options={{ headerShown: false }} />
      <Stack.Screen name="booking" options={{ headerShown: false }} />
      <Stack.Screen name="payment" options={{ headerShown: false }} />
      <Stack.Screen name="add-card" options={{ headerShown: false }} />
      <Stack.Screen name="confirm" options={{ headerShown: false }} />
      <Stack.Screen name="success" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="review" options={{ headerShown: false }} />
      <Stack.Screen name="EditProfileScreen" options={{ headerShown: false }} />
      <Stack.Screen name="ChangePasswordScreen" options={{ headerShown: false }} />
      <Stack.Screen name="NotificationSettingsScreen" options={{ headerShown: false }} />
      <Stack.Screen name="HelpCenterScreen" options={{ headerShown: false }} />
      <Stack.Screen name="ContactUsScreen" options={{ headerShown: false }} />
      <Stack.Screen name="PrivacyPolicyScreen" options={{ headerShown: false }} />
      <Stack.Screen name="AiDisclaimerScreen" options={{ headerShown: false }} />
      <Stack.Screen name="AccuracyTechScreen" options={{ headerShown: false }} />
      <Stack.Screen name="NotificationsScreen" options={{ headerShown: false }} />
      <Stack.Screen name="AdminDashboard" options={{ headerShown: false }} />
      <Stack.Screen name="DoctorMedicalInfoScreen" options={{ headerShown: false }} />
      <Stack.Screen name="PendingDoctorsScreen" options={{ headerShown: false }} />
      <Stack.Screen name="ApprovedDoctorsScreen" options={{ headerShown: false }} />

      <Stack.Screen name="upload" options={{ headerShown: false }} />
      <Stack.Screen name="DoctorProfileScreen" options={{ headerShown: false }} />
      <Stack.Screen name="GenerateReportScreen" options={{ headerShown: false }} />
      <Stack.Screen name="DoctorAppointmentsScreen" options={{ headerShown: false }} />
      <Stack.Screen name="result" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
    </Stack>
  );
}
