import express from "express";
import {
  addPost,
  getAllPost,
  addEmoji,
  addComment,
  updatePost,
  deletePost,
  retweetedPost,
  updateComment
} from "../controllers/postConroller.js";
import { isUserAuth } from "../controllers/userController.js";
import { isAuthorizedForPost } from "../isAuth.js";

const postRouter = express.Router();

postRouter.get("/getAllPost", getAllPost);
postRouter.post("/addPost", isUserAuth, addPost);
postRouter.post("/addEmoji", isUserAuth, addEmoji);
postRouter.post("/addComment", isUserAuth, addComment);
postRouter.post("/updateComment", isUserAuth, updateComment);
postRouter.post("/updatePost", isUserAuth, isAuthorizedForPost, updatePost);
postRouter.post("/deletePost", isUserAuth, isAuthorizedForPost, deletePost);
postRouter.post("/retweetPost", isUserAuth, retweetedPost);
export default postRouter;
