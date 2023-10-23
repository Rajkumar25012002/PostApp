import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { URL } from "../components/utils/API";
export const getAllUsers = createAsyncThunk("user/getAllUsers", async () => {
  try {
    const result = await axios.get(`${URL}/user/getAllUsers`);
    const data = result.data;
    return data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});
export const followUnfollowUser = createAsyncThunk(
  "user/followUnfollowUser",
  async (updatedDetails) => {
    try {
      const result = await axios.post(
        `${URL}/user/userConnection`,
        updatedDetails.details,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${updatedDetails.token}`,
          },
        }
      );
      const data = result.data;
      if (data.status === true) {
        return data.message;
      }
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
export const updatedUser = createAsyncThunk(
  "user/updateUser",
  async (updatedDetails) => {
    try {
      const result = await axios.post(
        `${URL}/user/updateUser`,
        updatedDetails.details,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${updatedDetails.token}`,
          },
        }
      );
      const data = result.data;
      if (data.status === true) {
        return data.message;
      }
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
export const deactivateUser = createAsyncThunk(
  "user/deactivateUser",
  async (updatedDetails) => {
    try {
      const result = await axios.post(
        `${URL}/user/deactivateUser`,
        updatedDetails.details,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${updatedDetails.token}`,
          },
        }
      );
      const data = result.data;
      if (data.status === true) {
        return data.message;
      }
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
const initialState = {
  users: [],
  status: "idle",
  err: null,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllUsers.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.status = "fulfilled";
      state.users = action.payload;
    });
    builder.addCase(getAllUsers.rejected, (state, action) => {
      state.status = "rejected";
      state.err = action.error.message;
    });
    builder.addCase(updatedUser.fulfilled, (state, action) => {
      const { userid } = action.payload;
      const updatedUser = state.users.map((usercontent) =>
        usercontent.userid === userid ? action.payload : usercontent
      );
      return {
        ...state,
        users: updatedUser,
      };
    });
    builder.addCase(updatedUser.rejected, (state, action) => {
      state.status = "rejected";
      state.err = action.error.message;
    });
    builder.addCase(deactivateUser.fulfilled, (state, action) => {
      state.status = "fulfilled";
      const { userid } = action.payload;
      const updatedUser = state.users.map((usercontent) =>
        usercontent.userid === userid ? action.payload : usercontent
      );
      return {
        ...state,
        users: updatedUser,
      };
    });
    builder.addCase(deactivateUser.rejected, (state, action) => {
      state.status = "rejected";
      state.err = action.error.message;
    });
    builder.addCase(followUnfollowUser.fulfilled, (state, action) => {
      state.status = "fulfilled";
      const { user1, user2 } = action.payload;
      const updatedUser = state.users.map((usercontent) =>
        usercontent.userid === user1.userid
          ? user1
          : usercontent.userid === user2.userid
          ? user2
          : usercontent
      );
      return {
        ...state,
        users: updatedUser,
      };
    });
    builder.addCase(followUnfollowUser.rejected, (state, action) => {
      state.status = "rejected";
      state.err = action.error.message;
    });
  },
});
export const getUserDetailsById = (state, userIdFromToken) =>
  state.user.users.find((user) => user.userid === userIdFromToken);
export const selectAllUsers = (state) => state.user.users;
export const getAllUsersStatus = (state) => state.user.status;
export const getUserError = (state) => state.user.err;
export const getUserNameById = (state, userIdFromToken) =>
  state.user.users.find((user) => user.userid === userIdFromToken)?.user_name;
export const getUserIdByName = (state, userName) =>
  state.user.users.find((user) => user.user_name === userName)?.userid;
export default userSlice.reducer;
