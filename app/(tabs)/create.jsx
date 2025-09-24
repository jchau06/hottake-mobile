import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { createPost } from "@/api/posts";
import FireLoadAnimation from "@/components/hottake/FireLoadAnimation.jsx";

export default function CreatePostScreen() {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const handlePostSubmit = async () => {
    if (!title.trim()) return Alert.alert("Error", "Post cannot be empty");

    setIsLoading(true);
    try {
      const newPost = await createPost(title);
      setIsLoading(false);
      setTitle("");
      router.push("/");
    } catch (err) {
      console.error("Error creating post:", err);
      Alert.alert("Error", err.message || "Something went wrong");
      setIsLoading(false);
    }
  };

  const themedStyles = isDark ? darkStyles : lightStyles;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={themedStyles.container}>
          <View style={themedStyles.card}>
            <Text style={themedStyles.header}>Share a hot take!</Text>
            <TextInput
              style={themedStyles.input}
              placeholder="Share a hot take of up to 140 characters!"
              placeholderTextColor={isDark ? "#9BA1A6" : "#A0AEC0"}
              maxLength={140}
              value={title}
              onChangeText={setTitle}
              multiline
            />

            <TouchableOpacity
              style={themedStyles.button}
              onPress={handlePostSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <FireLoadAnimation />
              ) : (
                <Text style={themedStyles.buttonText}>Post to HotTake</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const baseStyles = {
  card: {
    borderRadius: 12,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  header: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  input: { borderWidth: 1, borderRadius: 6, padding: 12, marginBottom: 16, textAlignVertical: "top", minHeight: 80 },
  button: { paddingVertical: 14, borderRadius: 8, alignItems: "center" },
  buttonText: { fontWeight: "600", fontSize: 16 },
};

const lightStyles = StyleSheet.create({
  ...baseStyles,
  container: { flex: 1, justifyContent: "center", padding: 16, backgroundColor: "#f8f9fa" },
  card: { ...baseStyles.card, backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.1 },
  header: { ...baseStyles.header, color: "#1A202C" },
  input: { ...baseStyles.input, borderColor: "#CBD5E0", backgroundColor: "#EDF2F7", color: "#1A202C" },
  button: { ...baseStyles.button, backgroundColor: "#319795" },
  buttonText: { ...baseStyles.buttonText, color: "#fff" },
});

const darkStyles = StyleSheet.create({
  ...baseStyles,
  container: { flex: 1, justifyContent: "center", padding: 16, backgroundColor: "#121212" },
  card: { ...baseStyles.card, backgroundColor: "#1E1E1E", shadowColor: "#000", shadowOpacity: 0.3 },
  header: { ...baseStyles.header, color: "#ECEDEE" },
  input: { ...baseStyles.input, borderColor: "#4A5568", backgroundColor: "#2A2A2A", color: "#ECEDEE" },
  button: { ...baseStyles.button, backgroundColor: "#319795" },
  buttonText: { ...baseStyles.buttonText, color: "#fff" },
});
