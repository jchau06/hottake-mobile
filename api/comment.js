import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

if (!API_BASE_URL) {
  console.warn("API_BASE_URL is not defined in expoConfig.extra");
}

// GET request to fetch comments for a post
export async function fetchComments(postID) {
  if (!postID) throw new Error("Missing postID");

  try {
    const response = await fetch(`${API_BASE_URL}/api/comment?postID=${postID}`);

    if (!response.ok) {
      let message = `Failed to fetch comments: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData?.message) message = errorData.message;
      } catch {
        // response not JSON, fallback to default message
      }
      throw new Error(message);
    }

    return await response.json();
  } catch (err) {
    console.error("fetchComments error:", err);
    throw err;
  }
}

// POST request to add a comment to a post
export async function addComment(postID, content) {
  if (!postID || !content) throw new Error("Missing postID or content");

  try {
    const response = await fetch(`${API_BASE_URL}/api/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postID, content }),
    });

    if (!response.ok) {
      let message = `Failed to add comment: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData?.message) message = errorData.message;
      } catch {
        // response not JSON, fallback to default message
      }
      throw new Error(message);
    }

    return await response.json();
  } catch (err) {
    console.error("addComment error:", err);
    throw err;
  }
}
