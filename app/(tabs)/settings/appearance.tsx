import { View, Text, StyleSheet, Switch } from "react-native";
import { useTheme } from "@/hooks/ThemeContext";

export default function AppearanceScreen() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Appearance</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
  },
  label: { fontSize: 16 },
});
