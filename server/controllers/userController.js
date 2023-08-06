import userCollection from "../models/userModel.js";
import { nanoid } from "nanoid";
import {
  createAccesToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} from "../token.js";
import "dotenv/config";
import pkg from "bcryptjs";
import pack from "jsonwebtoken";
import { isAuth } from "../isAuth.js";

const { verify } = pack;
const { hash, compare } = pkg;
export const registerUser = async (req, res, next) => {
  const { email, password, user_name } = req.body;
  try {
    const emailExists = await userCollection.findOne({ email: email });
    const userExists = await userCollection.findOne({ user_name: user_name });
    if (userExists) {
      res.send({
        message: "Username already exists!,try another username",
        status: false,
      });
    } else if (emailExists) {
      res.send({
        message: "Email already exists!,try another email",
        status: false,
      });
    } else {
      const hashedPassword = await hash(String(password), 10);
      const data = {
        userid: nanoid(),
        user_name: user_name,
        email: email,
        password: hashedPassword,
        refreshToken: null,
        userHistory: {
          userCreatedAt: new Date(),
        },
      };
      await userCollection.insertMany([data]).then(() =>
        res.send({
          message: `Hi,${user_name} your account has been created sueccessfully`,
          status: true,
        })
      );
    }
  } catch (err) {
    res.status(400).send({
      error: "Bad Request",
      message: "Cant register",
    });
  }
};
export const loginUser = async (req, res, next) => {
  const { user_name, password } = req.body;
  try {
    const user = await userCollection.findOne({ user_name: user_name });
    if (user) {
      const valid = await compare(password, user.password);
      if (!valid) {
        res.send({ message: "Invalid Password!,try again", status: false });
      }
      const accessToken = createAccesToken(user.userid, user.userRole);
      const refreshToken = createRefreshToken(user.userid);
      await userCollection.updateOne(
        { userid: user.userid },
        { $set: { refreshToken: refreshToken } }
      );
      sendRefreshToken(res, refreshToken);
      sendAccessToken(res, req, accessToken);
    } else {
      res.send({
        message: "Username not exists!,try to register",
        status: false,
      });
    }
  } catch (err) {
    res.status(400).send({
      error: "Bad Request",
      message: "Cant login",
    });
  }
};
export const logoutUser = async (_req, res, _next) => {
  res.clearCookie("refreshToken", { path: "/user/refresh_token" });
  return res.send({
    message: "Your account has been logged out successfully",
    status: true,
  });
};
export const refreshTokenForUser = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.send({ accessToken: null });
    let payload = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch {
      return res.send({ accessToken: null });
    }
    const user = await userCollection.findOne({ userid: payload.userid });
    if (!user) return res.send({ accessToken: null });
    if (token !== user.refreshToken) {
      return res.send({ accessToken: null });
    }
    const accessToken = createAccesToken(user.userid, user.userRole);
    const refreshToken = createRefreshToken(user.userid);
    await userCollection.updateOne(
      { userid: user.userid },
      { $set: { refreshToken: refreshToken } }
    );
    sendRefreshToken(res, refreshToken);
    return res.send({
      accessToken,
    });
  } catch (err) {
    res.status(400).send({
      error: "Bad Request",
      message: "Cant update refresh token",
    });
  }
};
export const isUserAuth = async (req, res, next) => {
  try {
    const userId = isAuth(req);
    if (userId !== null && userId) {
      next();
    } else {
      throw new Error("You aren't authorized to this page");
    }
  } catch (err) {
    res.status(400).send({
      error: "Bad Request",
      message: "You aren't authorized to this page",
    });
  }
};
export const getUserInfo = async (req, res, next) => {
  try {
    const { userid } = req.body;
    if (userid !== null && userid) {
      const user = await userCollection.findOne({ userid: userid });
      res.send({ message: user, status: true });
    } else {
      res.send({ message: "User info not found", status: false });
    }
  } catch (err) {
    res.status(400).send({
      error: "Bad Request",
      message: "Can't get user info",
    });
  }
};
export const getAllUsers = async (_req, res, next) => {
  try {
    const userData = await userCollection.find(
      {},
      {
        user_name: 1,
        email: 1,
        userid: 1,
        userRole: 1,
        userHistory: 1,
        userProfilePic: 1,
        isDeactivated: 1,
        deactivatedBy: 1,
      }
    );
    res.send(userData);
  } catch (err) {
    res.status(400).send({
      error: "Bad Request",
      message: "Can't get users",
    });
  }
};
export const updatedUser = async (req, res, next) => {
  try {
    const { userid, user_name, description, email, userRole } = req.body;
    if (userid !== null && userid) {
      const nested = "userHistory.description";
      const usernameExists = await userCollection.findOne({
        user_name: user_name,
      });
      const useremailExists = await userCollection.findOne({
        email: email,
      });
      if (
        (usernameExists.userid === userid &&
          useremailExists?.userid === userid) ||
        (!usernameExists && useremailExists?.userid === userid) ||
        (!useremailExists && usernameExists?.userid === userid)
      ) {
        const userdata = await userCollection.findOneAndUpdate(
          { userid: userid },
          {
            $set: {
              user_name: user_name,
              [nested]: description,
              email: email,
              userRole: userRole,
            },
          },
          { new: true }
        );
        res.send({ message: userdata, status: true });
      } else {
        res.status(400).send({ message: "User credential already found" });
      }
    } else {
      res.send({ message: "User info not found", status: false });
    }
  } catch (err) {
    res.status(400).send({
      error: "Bad Request",
      message: "Can't update user",
    });
  }
};
export const deactivateUser = async (req, res, next) => {
  try {
    const { userid, deactivatedBy } = req.body;
    if (userid !== null && userid) {
      const isUserExists = await userCollection.findOne({ userid: userid });
      const isUserDeactivated = isUserExists.isDeactivated;
      let userdata;
      if (!isUserDeactivated) {
        userdata = await userCollection.findOneAndUpdate(
          { userid: userid },
          { $set: { deactivatedBy: deactivatedBy, isDeactivated: true } },
          { new: true }
        );
      } else if (deactivatedBy === isUserExists.deactivatedBy) {
        userdata = await userCollection.findOneAndUpdate(
          { userid: userid },
          { $set: { isDeactivated: false, deactivatedBy: null } },
          { new: true }
        );
      } else {
        res.status(400).send({ message: "Can't activate/deactivate account" });
      }

      res.send({ message: userdata, status: true });
    } else {
      res.send({ message: "User info not found", status: false });
    }
  } catch (err) {
    res.status(400).send({
      error: "Bad Request",
      message: "Can't deactivate user",
    });
  }
};
