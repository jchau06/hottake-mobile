import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as Sharing from "expo-sharing";
import PostComment from "./PostComment";
import { agreeWithPost } from "../../api/agree.js";
import { disagreeWithPost } from "../../api/disagree.js";
import { fetchComments, addComment } from "../../api/comment.js";
import { useColorScheme } from "@/hooks/useColorScheme.ts";

export default function PostCard({
  uuid,
  scrollNext,
  setParentScrollEnabled,
  triggerFlash,
  ...post
}) {
  const [hasVoted, setHasVoted] = useState(
  (post.agree?.includes(uuid) || post.disagree?.includes(uuid)) ?? false
);

  const { id, title } = post;

  const [agree, setAgree] = useState(post.agree || []);
  const [disagree, setDisagree] = useState(post.disagree || []);
  const [comments, setComments] = useState([]);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  const commentInput = useRef(null);

  

  const scheme = useColorScheme(); 
  const styles = scheme === "dark" ? darkStyles : lightStyles;


  useEffect(() => {
  let cancelled = false;

  (async () => {
    try {
      setLoadingComments(true);
      const data = await fetchComments(id);
      if (!cancelled) setComments(data || []);
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      if (!cancelled) setLoadingComments(false);
    }
  })();

  return () => { cancelled = true };
}, [id]);

  const handleAgree = async () => {
    try {
      // Optimistic UI update
      setHasVoted(true);
      if (agree.includes(uuid)) {
        setAgree((prev) => prev.filter((id) => id !== uuid));
      } else {
        setAgree((prev) => [...prev, uuid]);
        setDisagree((prev) => prev.filter((id) => id !== uuid));
      }
      

      // Call API
      const updatedPost = await agreeWithPost(id, uuid);

      // Sync state with backend response
      setAgree(updatedPost.agree || []);
      setDisagree(updatedPost.disagree || []);
      setHasVoted(true);
      triggerFlash?.("green");


      setTimeout(() => scrollNext?.(), 750);
    } catch (err) {
      console.error("Failed to agree:", err);
      // Need more than log error.
      
    }
  };

  const handleDisagree = async () => {
    try {
      // Optimistic UI update
      setHasVoted(true);
      if (disagree.includes(uuid)) {
        setDisagree((prev) => prev.filter((id) => id !== uuid));
      } else {
        setDisagree((prev) => [...prev, uuid]);
        setAgree((prev) => prev.filter((id) => id !== uuid));
      }

      // Call API
      const updatedPost = await disagreeWithPost(id, uuid);

      // Sync with backend
      setAgree(updatedPost.agree || []);
      setDisagree(updatedPost.disagree || []);
      setHasVoted(true);
      triggerFlash?.("red");

      setTimeout(() => scrollNext?.(), 750);
    } catch (err) {
      console.error("Failed to disagree:", err);
      // Need more than log error.
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const savedComment = await addComment(id, newComment.trim());

      setComments((prev) => [...prev, savedComment]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleShare = async () => {
    try {
      await Sharing.shareAsync(null, {
        dialogTitle: "Share hottake",
        message: `Check out this hottake: ${title}\nhttps://hottake.gg/post/${id}`,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleReport = () => {
    console.log("Reported post:", id);
  };

  return (
    <View style={styles.card}>
      {/* Post Content */}
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Vote Buttons */}
      <View style={styles.voteRow}>
        <TouchableOpacity
          style={[
            styles.voteButton,
            styles.tealBorder,
            agree.includes(uuid) && styles.tealBg,
          ]}
          onPress={handleAgree}
        >
          {hasVoted ? (
            <Text style={styles.voteText}>
              {agree.length} <Icon name="thumbs-up" size={16} color="#319795" />
            </Text>
          ) : (
            <Icon name="thumbs-up" size={24} color="#319795" />
          )}
        </TouchableOpacity>

        <View style={styles.heat}>
          <Icon name="flame-outline" size={24} color="#A0AEC0" />
          {hasVoted && (
            <Text style={styles.heatText}>
              {agree.length + disagree.length}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.voteButton,
            styles.redBorder,
            disagree.includes(uuid) && styles.redBg,
          ]}
          onPress={handleDisagree}
        >
          {hasVoted ? (
            <Text style={styles.voteText}>
              <Icon name="thumbs-down" size={16} color="#E53E3E" />{" "}
              {disagree.length}
            </Text>
          ) : (
            <Icon name="thumbs-down" size={24} color="#E53E3E" />
          )}
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Footer: Comments Toggle + Share/Report */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.commentToggle}
          onPress={() => setCommentsOpen((c) => !c)}
        >
          <Icon name="chatbubble-outline" size={20} color="#718096" />
          <Text style={styles.commentToggleText}>
            {comments.length > 0
              ? `Comments (${comments.length})`
              : "No comments yet"}
          </Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={handleShare} style={{ marginRight: 16 }}>
            <Icon name="share-social-outline" size={22} color="#718096" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReport}>
            <Icon name="warning-outline" size={22} color="#718096" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Comments Section */}
      {commentsOpen && (
        <View style={styles.commentSectionWrapper}>
          {loadingComments ? (
            <Text style={{ color: "#718096" }}>Loading comments...</Text>
          ) : (
            <ScrollView
              style={{ flexGrow: 0, maxHeight: 175 }}
              contentContainerStyle={{ paddingBottom: 8 }}
              showsVerticalScrollIndicator
              onTouchStart={() => setParentScrollEnabled?.(false)}
              onScrollBeginDrag={() => setParentScrollEnabled?.(false)}
              onScrollEndDrag={() => setParentScrollEnabled?.(true)}
              onMomentumScrollEnd={() => setParentScrollEnabled?.(true)}
              onTouchEnd={() => setParentScrollEnabled?.(true)}
            >
              {comments.map((item) => (
                <PostComment
                  key={item.id}
                  content={item.content}
                  time={item.date}
                  dev={item.dev || "false"}
                />
              ))}
            </ScrollView>
          )}

          {/* Comment Input */}
          <TextInput
            ref={commentInput}
            placeholder="Comment your thoughts..."
            placeholderTextColor="#A0AEC0"
            style={styles.input}
            value={newComment}
            onChangeText={setNewComment}
            onSubmitEditing={handleAddComment}
          />
        </View>
      )}
    </View>
  );
}

const lightStyles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    margin: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    width: "90%",
    maxWidth: 400,
    alignSelf: "center",
    zIndex: 2,
  },
  body: { marginBottom: 12 },
  title: { fontSize: 20, fontWeight: "700", color: "#1A202C" },
  voteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  voteButton: {
    borderWidth: 2,
    borderRadius: 24,
    width: 72,
    height: 72,
    justifyContent: "center",
    alignItems: "center",
  },
  tealBorder: { borderColor: "#319795" },
  redBorder: { borderColor: "#E53E3E" },
  tealBg: { backgroundColor: "#B2F5EA" },
  redBg: { backgroundColor: "#FEB2B2" },
  voteText: { fontSize: 14, fontWeight: "600", color: "#2D3748" },
  heat: { flexDirection: "row", alignItems: "center", gap: 6 },
  heatText: { fontSize: 18, fontWeight: "600", color: "#4A5568" },
  divider: { height: 1, backgroundColor: "#E2E8F0", marginVertical: 12 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commentToggle: { flexDirection: "row", alignItems: "center", gap: 6 },
  commentToggleText: { color: "#718096", marginLeft: 6 },
  commentSectionWrapper: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    flexDirection: "column",
    flexShrink: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#4A5568",
    borderRadius: 6,
    padding: 8,
    backgroundColor: "#ecf2f8",
    color: "#708196",
    marginTop: 4,
  },
});


const darkStyles = StyleSheet.create({
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    margin: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    width: "90%",
    maxWidth: 400,
    alignSelf: "center",
  },
  body: { marginBottom: 12 },
  title: { fontSize: 20, fontWeight: "700", color: "#ECEDEE" },
  voteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  voteButton: {
    borderWidth: 2,
    borderRadius: 24,
    width: 72,
    height: 72,
    justifyContent: "center",
    alignItems: "center",
  },
  tealBorder: { borderColor: "#38B2AC" },
  redBorder: { borderColor: "#FC8181" },
  tealBg: { backgroundColor: "#285E5B" },
  redBg: { backgroundColor: "#9B2C2C" },
  voteText: { fontSize: 14, fontWeight: "600", color: "#ECEDEE" },
  heat: { flexDirection: "row", alignItems: "center", gap: 6 },
  heatText: { fontSize: 18, fontWeight: "600", color: "#9BA1A6" },
  divider: { height: 1, backgroundColor: "#2A2A2A", marginVertical: 12 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commentToggle: { flexDirection: "row", alignItems: "center", gap: 6 },
  commentToggleText: { color: "#9BA1A6", marginLeft: 6 },
  commentSectionWrapper: {
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 8,
    flexDirection: "column",
    flexShrink: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#9BA1A6",
    borderRadius: 6,
    padding: 8,
    backgroundColor: "#2A2A2A",
    color: "#ECEDEE",
    marginTop: 4,
  },
});



const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    margin: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    width: "90%",
    maxWidth: 400,
    alignSelf: "center",
  },
  body: { marginBottom: 12 },
  title: { fontSize: 20, fontWeight: "700", color: "#1A202C" },
  voteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  voteButton: {
    borderWidth: 2,
    borderRadius: 24,
    width: 72,
    height: 72,
    justifyContent: "center",
    alignItems: "center",
  },
  tealBorder: { borderColor: "#319795" },
  redBorder: { borderColor: "#E53E3E" },
  tealBg: { backgroundColor: "#B2F5EA" },
  redBg: { backgroundColor: "#FEB2B2" },
  voteText: { fontSize: 14, fontWeight: "600", color: "#2D3748" },
  heat: { flexDirection: "row", alignItems: "center", gap: 6 },
  heatText: { fontSize: 18, fontWeight: "600", color: "#4A5568" },
  divider: { height: 1, backgroundColor: "#E2E8F0", marginVertical: 12 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commentToggle: { flexDirection: "row", alignItems: "center", gap: 6 },
  commentToggleText: { color: "#718096", marginLeft: 6 },

  commentSectionWrapper: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    flexDirection: "column",
    flexShrink: 1,
  },

  input: {
    borderWidth: 1,
    borderColor: "#4A5568",
    borderRadius: 6,
    padding: 8,
    backgroundColor: "#ecf2f8",
    color: "#708196",
    marginTop: 4,
  },
});
