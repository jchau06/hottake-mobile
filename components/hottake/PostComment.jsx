import { View, Text, StyleSheet, useColorScheme } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function PostComment({ content, time, dev }) {
  const scheme = useColorScheme();
  const themed = scheme === "dark" ? darkStyles : lightStyles;

  const date = time ? new Date(time) : new Date();

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  function formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  }

  return (
    <View style={themed.container}>
      {/* Divider */}
      <View style={themed.divider} />

      {/* Metadata */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={themed.metaText}>
          {`${formatAMPM(date)}, ${months[date.getMonth()]} ${date.getDate()}`}
        </Text>
        {dev === "true" && (
          <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 6 }}>
            <Icon name="checkmark-circle" size={12} color="#3B82F6" />
            <Text style={themed.devText}>Dev</Text>
          </View>
        )}
      </View>

      {/* Comment body */}
      <Text style={themed.content}>{content}</Text>
    </View>
  );
}

const baseStyles = {
  container: {
    marginVertical: 4,
    paddingHorizontal: 8,
  },
  metaText: {
    fontSize: 12,
  },
  devText: {
    fontSize: 12,
    marginLeft: 2,
  },
  content: {
    fontSize: 14,
    marginTop: 2,
  },
};

const lightStyles = StyleSheet.create({
  ...baseStyles,
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginBottom: 6,
  },
  metaText: {
    ...baseStyles.metaText,
    color: "#718096",
  },
  devText: {
    ...baseStyles.devText,
    color: "#3B82F6", // blue-500
  },
  content: {
    ...baseStyles.content,
    color: "#1A202C",
  },
});

const darkStyles = StyleSheet.create({
  ...baseStyles,
  divider: {
    height: 1,
    backgroundColor: "#2D3748",
    marginBottom: 6,
  },
  metaText: {
    ...baseStyles.metaText,
    color: "#9BA1A6",
  },
  devText: {
    ...baseStyles.devText,
    color: "#60A5FA", 
  },
  content: {
    ...baseStyles.content,
    color: "#ECEDEE",
  },
});
