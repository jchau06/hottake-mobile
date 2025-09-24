import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export async function agreeWithPost(postID, userUUID) {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined in expoConfig.extra");
  }
  if (!postID || !userUUID) {
    throw new Error("Missing postID or userUUID");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/agree`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postID, userUUID }),
    });

    if (!response.ok) {
      let message = `Failed to agree with post: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData?.message) message = errorData.message;
      } catch {
        // fallback if response is not JSON
      }
      throw new Error(message);
    }

    return await response.json();
  } catch (err) {
    console.error("agreeWithPost error:", err);
    throw err;
  }
}
