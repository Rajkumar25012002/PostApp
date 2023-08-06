import mongoose from "mongoose";
import ROLE from "../Roles.js";
const userHistorySchema = new mongoose.Schema({
  description: {
    type: String,
    default: "",
  },
  userCreatedAt: {
    type: Date,
  },
});
const userSchema = new mongoose.Schema({
  userid: {
    type: String,
  },
  user_name: {
    type: String,
  },
  userProfilePic: {
    type: String,
  },
  userHistory: userHistorySchema,
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  userRole: {
    type: String,
    default: ROLE.USER,
  },
  refreshToken: {
    type: String,
    required: false,
  },
  isDeactivated: {
    type: Boolean,
    default: false,
  },
  deactivatedBy: {
    type: String,
    default: null,
  }
});
const userCollection = mongoose.model("user", userSchema);
export default userCollection;
