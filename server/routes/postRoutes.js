import express from "express";
import {
  addPost,
  getAllPost,
  addEmoji,
  addComment,
  updatePost,
  deletePost,
  retweetedPost,
  updateComment,
  getLimitedPost,
  getUserCommentedPosts,
  getUserLikedPosts,
  getUserPosts
} from "../controllers/postConroller.js";
import { isUserAuth } from "../controllers/userController.js";
import { isAuthorizedForPost } from "../isAuth.js";

const postRouter = express.Router();

postRouter.get("/getAllPost", getAllPost);
postRouter.get("/getLimitedPosts",getLimitedPost)
postRouter.get("/getUserPosts", getUserPosts);
postRouter.get("/getUserCommentedPosts", getUserCommentedPosts);
postRouter.get("/getUserLikedPosts", getUserLikedPosts);
postRouter.post("/addPost", isUserAuth, addPost);
postRouter.post("/addEmoji", isUserAuth, addEmoji);
postRouter.post("/addComment", isUserAuth, addComment);
postRouter.post("/updateComment", isUserAuth, updateComment);
postRouter.post("/updatePost", isUserAuth, isAuthorizedForPost, updatePost);
postRouter.post("/deletePost", isUserAuth, isAuthorizedForPost, deletePost);
postRouter.post("/retweetPost", isUserAuth, retweetedPost);

export default postRouter;
