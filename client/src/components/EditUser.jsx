import React from "react";
import styled from "styled-components";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updatedUser } from "../features/userSlice";
import { useContext } from "react";
import { UserContext } from "../App";
import ROLE from "./utils/USERROLE.js";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { getUserError, getAllUsersStatus } from "../features/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  toastOptionError,
  toastOptionSuccess,
} from "../components/utils/toastOptions";
function EditUser({ onClose, userinfo }) {
  const { user, userRoleFromToken, userIdFromToken } = useContext(UserContext);
  const dispatch = useDispatch();
  const userStatus = useSelector(getAllUsersStatus);
  const userError = useSelector(getUserError);
  const [username, setUsername] = useState(userinfo.user_name);
  const [description, setDescription] = useState(
    userinfo.userHistory.description
  );
  const [userrole, setUserrole] = useState(userinfo.userRole);
  const [email, setEmail] = useState(userinfo.email);
  const handleChange = (e) => {
    if (e.target.name === "username") {
      setUsername(e.target.value);
    }
    if (e.target.name === "content") {
      setDescription(e.target.value);
    }
    if (e.target.name === "email") {
      setEmail(e.target.value);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updatedUser({
        details: {
          userid: userinfo.userid,
          user_name: username,
          description: description,
          email: email,
          userRole: userrole,
        },
        token: user.accessToken,
      })
    );
    if (userStatus === "fulfilled") {
      toast.success("User updated successfully", toastOptionSuccess);
    } else {
      toast.error(userError, toastOptionError);
    }
    onClose(false);
  };
  return (
    <Container>
      <div className="popup-content">
        <button className="close-btn" onClick={() => onClose(false)}>
          &times;
        </button>
        <form className="form" onSubmit={handleSubmit}>
          <h2>Edit User</h2>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleChange}
            placeholder="Username"
          ></input>
          <input
            type="text"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Email"
          ></input>
          {userRoleFromToken === ROLE.ADMIN &&
            userinfo.userid !== userIdFromToken && (
              <select
                className="role-select"
                value={userrole}
                name="role"
                onChange={(e) => setUserrole(e.target.value)}
              >
                {Object.values(ROLE).map((value, index) => {
                  return <option key={index}>{value}</option>;
                })}
              </select>
            )}
          <textarea
            name="content"
            value={description}
            onChange={handleChange}
            placeholder="Edit your bio"
          ></textarea>
          <button type="submit">Update</button>
        </form>
      </div>
      <ToastContainer />
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  .popup-content {
    background-color: #fff;
    padding: 2rem;
    width: 20vw;
    height: max-content;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    position: relative;
    .close-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 2rem;
      background-color: transparent;
      border: none;
      cursor: pointer;
    }
  }
  .form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    h2 {
      text-align: center;
    }
    input,
    textarea,
    select {
      padding: 0.5rem;
      outline: none;
      border-radius: 0.25rem;
      border: none;
      border: 1px solid rgb(159, 158, 158);
    }
    textarea {
      resize: none;
      height: 10rem;
    }
    button {
      background-color: var(--button);
      border: none;
      align-self: center;
      padding: 0.5rem;
      border-radius: 0.5rem;
      width: 6rem;
      color: white;
      outline: none;
    }
  }
`;

export default EditUser;
