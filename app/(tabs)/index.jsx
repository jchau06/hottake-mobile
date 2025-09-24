import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import {
  Dimensions,
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Text,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PostCard from "@/components/hottake/PostCard";
import { fetchPosts } from "@/api/posts";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FireLoadAnimation from "@/components/hottake/FireLoadAnimation.jsx";

const { height } = Dimensions.get("window");

const SORT_OPTIONS = [
  { key: "hot", label: "Sort by Hot", icon: <MaterialCommunityIcons name="fire" size={20} color="#fff" /> },
  { key: "new", label: "Sort by New", icon: <Ionicons name="time" size={20} color="#fff" /> },
  { key: "old", label: "Sort by Old", icon: <Ionicons name="hourglass-outline" size={20} color="#fff" /> },
  { key: "popular", label: "Sort by Popular", icon: <FontAwesome5 name="star" size={20} color="#fff" /> },
  { key: "random", label: "Sort by Random", icon: <FontAwesome5 name="random" size={20} color="#fff" /> },
  { key: "agreed", label: "Sort by Agreed", icon: <Ionicons name="thumbs-up" size={20} color="#fff" /> },
  { key: "disagreed", label: "Sort by Disagreed", icon: <Ionicons name="thumbs-down" size={20} color="#fff" /> },
  { key: "reported", label: "Sort by Reported", icon: <MaterialCommunityIcons name="alert-circle" size={20} color="#fff" /> },
];

// Memoized PostCard for performance
const MemoizedPostCard = React.memo(PostCard);

export default function HomeScreen({ route }) {
  const listRef = useRef(null);
  const insets = useSafeAreaInsets();
  const adjustedHeight = height - insets.top - insets.bottom;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parentScrollEnabled, setParentScrollEnabled] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sortOption, setSortOption] = useState("hot");
  const [flashColor, setFlashColor] = useState(null); 

  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  // Reset to "new" after creating a post
  useEffect(() => {
    if (route?.params?.newPostId) {
      setSortOption("new");
    }
  }, [route?.params?.newPostId]);

  // Fetch posts when sortOption changes
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchPosts(sortOption);
        setPosts(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, [sortOption]);

  // Cycle sort options
  const cycleSort = () => {
    const currentIndex = SORT_OPTIONS.findIndex((o) => o.key === sortOption);
    const nextIndex = (currentIndex + 1) % SORT_OPTIONS.length;
    setSortOption(SORT_OPTIONS[nextIndex].key);
  };

  // Reset card position when keyboard hides
  useEffect(() => {
    const sub = Keyboard.addListener("keyboardDidHide", () => {
      if (listRef.current) {
        listRef.current.scrollToIndex({ index: currentIndex, animated: true });
      }
    });
    return () => sub.remove();
  }, [currentIndex]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  // Precompute style for page
  const pageStyle = useMemo(
    () => [styles.page, { height: adjustedHeight, backgroundColor: isDark ? "#121212" : "#fff" }],
    [adjustedHeight, isDark]
  );

  // Memoized renderItem
  const renderItem = useCallback(
    ({ item, index }) => (
      <View style={pageStyle}>
        <MemoizedPostCard
          uuid={item.id}
          {...item}
          scrollNext={() => {
            if (index + 1 < posts.length) {
              listRef.current?.scrollToIndex({ index: index + 1, animated: true });
            }
          }}
          setParentScrollEnabled={setParentScrollEnabled}
          triggerFlash={(color) => {
            setFlashColor(color);
            setTimeout(() => setFlashColor(null), 600); // remove after 0.4s
          }}

        />
      </View>
    ),
    [pageStyle, posts.length]
  );

  if (loading)
    return (
      <View style={[styles.center, { height: adjustedHeight, backgroundColor: isDark ? "#121212" : "#fff" }]}>
        <FireLoadAnimation />
      </View>
    );

  if (error)
    return (
      <View style={[styles.center, { height: adjustedHeight, backgroundColor: isDark ? "#121212" : "#fff" }]}>
        <Text style={{ color: isDark ? "#ECEDEE" : "#1A202C" }}>Error: {error}</Text>
      </View>
    );

  const currentSort = SORT_OPTIONS.find((o) => o.key === sortOption);

  return (
  <KeyboardAvoidingView
    style={{ flex: 1, backgroundColor: isDark ? "#121212" : "#fff" }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={5}
  >
    
    {parentScrollEnabled && (
      <TouchableOpacity style={styles.sortButton} onPress={cycleSort}>
        {currentSort.icon}
        <Text style={styles.sortText}>{currentSort.label}</Text>
      </TouchableOpacity>
    )}

    {/* Flash overlay - WORK IN PROGRESS */}
    {flashColor && (
      <View
        pointerEvents="none"
        style={[
          styles.flashOverlay,
          flashColor === "green"
            ? { backgroundColor: isDark ? "#285E5B" : "#B2F5EA", left: 0 }
            : { backgroundColor: isDark ? "#9B2C2C" : "#FEB2B2", right: 0 },
          { zIndex: 0, elevation: 0 },
        ]}
      />
    )}

    
    <View style={{ flex: 1, zIndex: 1, elevation: 1 }}>
      <FlatList
        ref={listRef}
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        pagingEnabled
        snapToInterval={adjustedHeight}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        scrollEnabled={parentScrollEnabled}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        removeClippedSubviews
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
      />
    </View>
  </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
  page: { justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
  center: { justifyContent: "center", alignItems: "center" },
sortButton: {
  position: "absolute",
  top: 48,
  left: 16,
  zIndex: 10, 
  backgroundColor: "#319795",
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 8,
  flexDirection: "row",
  alignItems: "center",
},

  sortText: { color: "#fff", fontWeight: "700", marginLeft: 6 },
  flashOverlay: {
  position: "absolute",
  top: 0,
  bottom: 0,
  width: "50%",
  opacity: 0.7,
  zIndex: 1, 
},


});
