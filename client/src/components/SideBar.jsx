import React from "react";
import styled from "styled-components";
import { useState } from "react";
import { FaUserCircle, FaUserEdit } from "react-icons/fa";
import { GrEmoji } from "react-icons/gr";
import Picker from "emoji-picker-react";
import { useDispatch } from "react-redux";
import { addPost } from "../features/postSlice";
import { useContext } from "react";
import { UserContext } from "../App";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import EditUser from "./EditUser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  toastOptionError,
  toastOptionSuccess,
} from "../components/utils/toastOptions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { getStateErr, getStateStatus } from "../features/postSlice";
const SideBar = () => {
  const { user, userIdFromToken, userInfo } = useContext(UserContext);
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [addPostRequest, setAddPostRequest] = useState("idle");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showUserEditor, setShowUserEditor] = useState(false);
  const postStatus = useSelector(getStateStatus);
  const postErr = useSelector(getStateErr);
  const dispatch = useDispatch();
  const addPoster = (e) => {
    e.preventDefault();
    if (tag && content && addPostRequest === "idle") {
      try {
        setAddPostRequest("pending");
        dispatch(
          addPost({
            details: {
              title: tag,
              userName: userInfo.user_name,
              userid: userIdFromToken,
              datePosted: new Date().toISOString(),
              content,
            },
            token: user.accessToken,
          })
        );
        setTag("");
        setContent("");
        if (postStatus === "succeeded") {
          toast.success("Post added successfully", toastOptionSuccess);
        } else {
          toast.error(postErr, toastOptionError);
        }
      } catch (err) {
        console.log("failed to add post", err);
      } finally {
        setAddPostRequest("idle");
      }
    }
  };
  const handleEmojiClick = (emoji) => {
    let msg = content;
    msg += emoji.emoji;
    setContent(msg);
  };
  return (
    <Container>
      <div className="user-info">
        <span className="user-profile">
          <Link to={`/user/${userIdFromToken}`}>
            <FaUserCircle size="3rem" className="user-img" />
          </Link>
          {userInfo?.user_name && (
            <p className="user-name">{userInfo.user_name}</p>
          )}
          <p>{`${userInfo.isDeactivated ? "🔴" : "🟢"}`}</p>
          <FaUserEdit
            className="edit-icon"
            size="1.5rem"
            onClick={() => setShowUserEditor(true)}
          />
        </span>
        {userInfo?.userRole && (
          <div className="user-role">{`${userInfo.userRole}`}</div>
        )}
        <p className="description">
          {userInfo?.userHistory.description
            ? userInfo.userHistory.description
            : "Hello"}
        </p>
        {userInfo?.userHistory?.userCreatedAt && (
          <div className="joined-history">{`Joined on - ${format(
            new Date(userInfo.userHistory.userCreatedAt),
            "MMM dd,yyy"
          )}`}</div>
        )}
      </div>
      <div className="create-post">
        <input
          className="header"
          onChange={(e) => setTag(e.target.value)}
          value={tag}
          placeholder="Tag a post header"
        ></input>
        <textarea
          onClick={() => setShowEmojiPicker(false)}
          className="content"
          placeholder="What's on your mind...."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <div className="button-container">
          <div className="emoji-container">
            <GrEmoji
              className="emoji-icon"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            ></GrEmoji>
            {showEmojiPicker && (
              <Picker
                onEmojiClick={handleEmojiClick}
                height="325px"
                width="250px"
              />
            )}
          </div>
          <button className="create-post-btn" onClick={addPoster}>
            Create Post
          </button>
        </div>
      </div>
      <div className="logo">
        <img
          src="https://www.freeiconspng.com/uploads/blue-blogger-logo-icon-png-14.png"
          width="150px"
          alt="Blue blogger logo"
        />
      </div>
      {showUserEditor && userInfo?.userHistory && (
        <EditUser userinfo={userInfo} onClose={setShowUserEditor} />
      )}
      <ToastContainer />
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  gap: 0.5rem;
  background-color: var(--page-background);
  border: 1px solid rgb(219, 219, 219);
  color: var(--text-normal);
  max-height: 85vh;
  .user-info {
    display: flex;
    padding: 0.5rem;
    border-radius: 0.5rem;
    flex-direction: column;
    border: 1px solid rgb(219, 219, 219);
    .user-profile {
      display: flex;
      margin: 0;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.15rem;
      .user-img {
        color: rgb(76, 181, 249);
      }
      .user-name {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--text-header);
        font-family: "Lucida Sans";
        margin-right: 2px;
      }
      .edit-icon {
        text-align: right;
        cursor: pointer;
        margin-left: auto;
        transition: 0.3s ease-in-out;
        &:hover {
          transform: scale(1.1);
        }
      }
    }
    .description {
      margin: 0;
      font-size: 1rem;
      font-weight: 300;
      color: var(--text-normal);
    }
    .user-role {
      color: var(--text-normal);
      font-weight: 600;
      font-family: var(--font-family);
    }
    .joined-history {
      color: var(--text-normal);
      font-size: 0.8rem;
    }
  }
  .create-post {
    display: flex;
    padding: 0.5rem;
    border-radius: 0.5rem;
    flex-direction: column;
    gap: 0.5rem;
    height: max-content;
    border: 1px solid rgb(219, 219, 219);
    .header {
      border-radius: 0.25rem;
      outline: none;
      background-color: rgb(229, 238, 239);
      border: 1px solid rgb(182, 182, 182);
      padding: 0.5rem;
    }
    .content {
      border-radius: 0.25rem;
      outline: none;
      background-color: rgb(229, 238, 239);
      border: 1px solid rgb(182, 182, 182);
      padding: 0.5rem;
      height: 10rem;
      font-family: var(--font-family);
      color: var(--text-normal);
      overflow-y: scroll;
      &::-webkit-scrollbar {
        width: 0.25rem;
        &-thumb {
          background-color: rgba(105, 208, 242, 0.66);
          width: 0.1rem;
          border-radius: 1rem;
        }
      }
    }
    .button-container {
      display: flex;
      gap: 0.25rem;
      align-items: center;
      justify-content: space-around;
      .emoji-container {
        position: relative;
        .emoji-icon {
          font-size: 1.5rem;
          position: relative;
          background-color: #ffff00fe;
          border-radius: 1.5rem;
          cursor: pointer;
        }
        .EmojiPickerReact {
          position: absolute;
          top: -350px;
          border-color: rgba(105, 208, 242, 0.66);
          .epr-body::-webkit-scrollbar {
            width: 5px;
            scroll-behavior: smooth;
            &-thumb {
              background-color: rgba(105, 208, 242, 0.66);
            }
          }
          .epr-search-container {
            input {
              background-color: transparent;
              border-color: rgba(105, 208, 242, 0.66);
            }
          }
          .epr-emoji-category-label {
            background-color: rgba(105, 208, 242);
            color: #ffffff;
          }
        }
      }
      .create-post-btn {
        font-size: 1rem;
        border-radius: 0.5rem;
        border: none;
        flex: 0.5;
        outline: none;
        padding: 0.25rem;
        cursor: pointer;
        color: var(--text-button);
        background-color: var(--button);
        transition: 0.3s ease-out;
        &:hover {
          background-color: var(--button-hover);
        }
      }
    }
  }
  .logo {
    text-align: center;
  }
`;
export default SideBar;
