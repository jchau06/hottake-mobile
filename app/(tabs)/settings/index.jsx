import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      
      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push("/(tabs)/settings/notifications")}
      >
        <Text style={styles.itemText}>Notifications</Text>
      </TouchableOpacity>

      
      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push("/(tabs)/settings/appearance")}
      >
        <Text style={styles.itemText}>Appearance</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  item: {
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
  },
  itemText: { fontSize: 16 },
});
