// mobile/api/posts.js
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL


/**
 * Fetch posts with optional sorting and pagination
 * Future Change: remove offset and limit, possibly remove sort
 */
export async function fetchPosts(sort = 'new', offset = 0, limit = 10) {
  try {
    const url = `${API_BASE_URL}/api/posts?sort=${sort}&offset=${offset}&limit=${limit}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error('fetchPosts error:', err);
    throw err;
  }
}

/**
 * Fetch a single post by ID
 */
export async function fetchPostById(postID) {
  if (!postID) throw new Error('postID is required');

  try {
    const url = `${API_BASE_URL}/api/post?postID=${postID}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error('fetchPostById error:', err);
    throw err;
  }
}

/**
 * POST request to create a new post
 */
export async function createPost(title) {
  if (!title?.trim()) throw new Error("Post title is required");

  try {
    const response = await fetch(`${API_BASE_URL}/api/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: title.trim() }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create post");
    }

    const newPost = await response.json();
    return newPost;
  } catch (err) {
    console.error("createPost error:", err);
    throw err;
  }
}

