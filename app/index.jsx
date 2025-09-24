// app/index.tsx
import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { router } from "expo-router";
import FireLoadAnimation from "@/components/hottake/FireLoadAnimation"

export default function Index() {
  useEffect(() => {
    // Redirects to main tab screen after 1 second, may remove in future build
    const timer = setTimeout(() => {
      router.replace("/(tabs)"); 
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    // Load animation while redirecting
    <View style={styles.container}>
      <FireLoadAnimation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // matches FireLoadAnimation bg
  },
});
