import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

if (!API_BASE_URL) {
  console.warn("API_BASE_URL is not defined in expoConfig.extra");
}

export async function disagreeWithPost(postID, userUUID) {
  if (!postID || !userUUID) {
    throw new Error("Missing postID or userUUID");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/disagree`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postID, userUUID }),
    });

    if (!response.ok) {
      let message = `Failed to disagree with post: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData?.message) message = errorData.message;
      } catch {
        // fallback to default message if response is not JSON
      }
      throw new Error(message);
    }

    const updatedPost = await response.json();
    return updatedPost;
  } catch (err) {
    console.error("disagreeWithPost error:", err);
    throw err;
  }
}
