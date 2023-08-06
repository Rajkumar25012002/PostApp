import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshTokenForUser,
  isUserAuth,
  getAllUsers,
  updatedUser,
  deactivateUser
} from "../controllers/userController.js";
import { isAuthorizedUserUpdate } from "../isAuth.js";

const userRouter = express.Router();

userRouter.get("/getAllUsers", getAllUsers);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.post("/refresh_token", refreshTokenForUser);
userRouter.post("/isUserAuth", isUserAuth);
userRouter.post("/updateUser", isUserAuth, isAuthorizedUserUpdate, updatedUser);
userRouter.post("/deactivateUser", isUserAuth, isAuthorizedUserUpdate, deactivateUser);

export default userRouter;
