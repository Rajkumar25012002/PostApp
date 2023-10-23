import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { createSelector } from "@reduxjs/toolkit";
import { URL } from "../components/utils/API";
export const getAllPost = createAsyncThunk("post/getAllPost", async () => {
  try {
    const result = await axios.get(`${URL}/post/getAllPost`);
    const data = result.data;
    return data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});
export const updatePost = createAsyncThunk(
  "post/updatePost",
  async (updatedContent) => {
    try {
      const result = await axios.post(
        `${URL}/post/updatePost`,
        updatedContent.details,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${updatedContent.token}`,
          },
        }
      );
      const data = result.data;
      return data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
export const updateComment = createAsyncThunk(
  "post/updateComment",
  async (updatedComment) => {
    try {
      const result = await axios.post(
        `${URL}/post/updateComment`,
        updatedComment.details,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${updatedComment.token}`,
          },
        }
      );
      const data = result.data;
      return data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
export const retweetedPost = createAsyncThunk(
  "post/retweetPost",
  async (retweetPost) => {
    try {
      const res = await axios.post(
        `${URL}/post/retweetPost`,
        retweetPost.details,
        {
          headers: { authorization: `Bearer ${retweetPost.token}` },
        }
      );
      return res.data;
    } catch (err) {
      throw new Error(err.response.data.message);
    }
  }
);
export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (postId) => {
    try {
      const result = await axios.post(
        `${URL}/post/deletePost`,
        postId.details,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${postId.token}`,
          },
        }
      );
      const data = result.data;
      return data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
export const addEmoji = createAsyncThunk(
  "post/addEmoji",
  async (updatedPost) => {
    try {
      const result = await axios.post(
        `${URL}/post/addEmoji`,
        updatedPost.details,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${updatedPost.token}`,
          },
        }
      );
      const data = result.data;
      return data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
export const addComment = createAsyncThunk(
  "post/addComment",
  async (addComment) => {
    try {
      const result = await axios.post(
        `${URL}/post/addComment`,
        addComment.details,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${addComment.token}`,
          },
        }
      );
      const data = result.data;
      return data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
export const addPost = createAsyncThunk("post/addPost", async (initialPost) => {
  try {
    const result = await axios.post(
      `${URL}/post/addPost`,
      initialPost.details,
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${initialPost.token}`,
        },
      }
    );
    return result.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});
const initialState = {
  posts: [],
  status: "idle",
  err: null,
};
const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllPost.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getAllPost.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.posts = action.payload;
    });
    builder.addCase(getAllPost.rejected, (state, action) => {
      state.status = "failed";
      state.err = action.error.message;
    });
    builder.addCase(addPost.fulfilled, (state, action) => {
      state.status = "succeeded";
      const updatedPosts = state.posts.concat(action.payload);
      return {
        ...state,
        posts: updatedPosts,
      };
    });
    builder.addCase(addPost.rejected, (state, action) => {
      state.status = "rejected";
      state.err = action.error.message;
    });
    builder.addCase(addEmoji.fulfilled, (state, action) => {
      const { postId } = action.payload;
      const updatedPosts = state.posts.map((post) =>
        post.postId === postId ? action.payload : post
      );
      return {
        ...state,
        posts: updatedPosts,
      };
    });
    builder.addCase(addComment.fulfilled, (state, action) => {
      const { postId } = action.payload;
      const updatedPosts = state.posts.map((post) =>
        post.postId === postId ? action.payload : post
      );
      return {
        ...state,
        posts: updatedPosts,
      };
    });
    builder.addCase(addComment.rejected, (state, action) => {
      state.status = "rejected";
      state.err = action.error.message;
    });
    builder.addCase(updatePost.fulfilled, (state, action) => {
      state.status = "succeeded";
      const { postId } = action.payload;
      const updatedPosts = state.posts.map((post) =>
        post.postId === postId ? action.payload : post
      );
      return {
        ...state,
        posts: updatedPosts,
      };
    });
    builder.addCase(updatePost.rejected, (state, action) => {
      state.status = "rejected";
      state.err = action.error.message;
    });
    builder.addCase(updateComment.fulfilled, (state, action) => {
      state.status = "succeeded";
      const { postId } = action.payload;
      const updatedPosts = state.posts.map((post) =>
        post.postId === postId ? action.payload : post
      );
      return {
        ...state,
        posts: updatedPosts,
      };
    });
    builder.addCase(updateComment.rejected, (state, action) => {
      state.status = "rejected";
      state.err = action.error.message;
    });
    builder.addCase(deletePost.fulfilled, (state, action) => {
      state.status = "succeeded";
      const updatedPosts = state.posts.filter(
        (post) => post.postId !== action.payload
      );
      return {
        ...state,
        posts: updatedPosts,
      };
    });
    builder.addCase(deletePost.rejected, (state, action) => {
      state.status = "rejected";
      state.err = action.error.message;
    });
    builder.addCase(retweetedPost.fulfilled, (state, action) => {
      const { postId, postRetweet, retweetedBy } = action.payload;
      const updatedPosts = state.posts.map((post) =>
        post.postId === postId ? action.payload.post : post
      );
      let postUpdate;
      if (postRetweet === null) {
        postUpdate = updatedPosts.filter(
          (post) =>
            !(
              post.originalPostId === postId && retweetedBy === post.retweetedBy
            )
        );
      } else {
        postUpdate = updatedPosts.concat(postRetweet);
      }
      return {
        ...state,
        posts: postUpdate,
      };
    });
  },
});
export const selectAllPosts = (state) => state.post.posts;
export const getStateStatus = (state) => state.post.status;
export const getStateErr = (state) => state.post.err;
export const selectPostByUserId = createSelector(
  [selectAllPosts, (state, userid) => userid],
  (posts, userid) => {
    return posts.filter(
      (post) =>
        (post.userid === userid && !post.isRetweet) ||
        userid === post.retweetedBy
    );
  }
);
export const getPostById = (state, postId) =>
  state.post.posts.find((post) => post.postId === postId);
export const getAllLikedPostsByUser = createSelector(
  [selectAllPosts, (state, userid) => userid],
  (posts, userid) => {
    return posts.filter((post) => post.likes.includes(userid));
  }
);
export const getAllCommentedPostsByUserId = createSelector(
  [selectAllPosts, (state, userid) => userid],
  (posts, userid) => {
    return posts.filter((post) => {
      return post.comments.find((comment) => comment.authorId === userid);
    });
  }
);
export default postSlice.reducer;
