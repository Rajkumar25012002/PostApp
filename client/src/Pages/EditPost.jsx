import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getPostById,
  updatePost,
  deletePost,
  getStateStatus,
  getStateErr,
} from "../features/postSlice";
import styled from "styled-components";
import { useState } from "react";
import Picker from "emoji-picker-react";
import { GrEmoji } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  toastOptionError,
  toastOptionSuccess,
} from "../components/utils/toastOptions";
const EditPost = () => {
  const { user, userIdFromToken } = useContext(UserContext);
  const { id } = useParams();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentpost = useSelector((state) => getPostById(state, id));
  const [content, setContent] = useState(
    currentpost?.content ? currentpost.content : ""
  );
  const [tag, setTag] = useState(currentpost?.title ? currentpost.title : "");
  const postStatus = useSelector(getStateStatus);
  const postErr = useSelector(getStateErr);

  const editPoster = () => {
    if (tag && content) {
      dispatch(
        updatePost({
          details: {
            editor: currentpost.userid,
            postId: id,
            title: tag,
            content,
            datePosted: new Date().toISOString(),
          },
          token: user.accessToken,
        })
      );
      if (postStatus === "succeeded") {
        toast.success("Post updated successfully", toastOptionSuccess);
      } else {
        toast.warning(postErr, toastOptionError);
      }
      navigate("/");
    } else {
      alert("please fill all the fields");
    }
  };
  const deletePoster = () => {
    if (id !== null && id) {
      dispatch(
        deletePost({
          details: {
            editor: currentpost.userid,
            postId: id,
          },
          token: user.accessToken,
        })
      );
      if (postStatus === "succeeded") {
        toast.success("Post deleted successfully", toastOptionSuccess);
      } else {
        toast.warning(postErr, toastOptionError);
      }
      navigate("/");
    } else {
      alert("post does not exist");
    }
  };
  const handleEmojiClick = (emoji) => {
    let msg = content;
    msg += emoji.emoji;
    setContent(msg);
  };
  return (
    <Container>
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
          <button className="create-post-btn" onClick={editPoster}>
            Edit Post
          </button>
          <button className="create-post-btn" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button className="create-post-btn" onClick={deletePoster}>
            Delete
          </button>
        </div>
      </div>
      <ToastContainer />
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  height: 70vh;
  gap: 0.5rem;
  margin: 2rem;
  .create-post {
    display: flex;
    padding: 0.5rem;
    border-radius: 0.5rem;
    align-self: center;
    flex-direction: column;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    min-width: 35rem;
    border: 1px solid rgb(219, 219, 219);
    .header {
      border-radius: 0.25rem;
      outline: none;
      background-color: rgb(229, 238, 239);
      width: 95%;
      border: 1px solid rgb(182, 182, 182);
      padding: 0.5rem;
    }
    .content {
      border-radius: 0.25rem;
      outline: none;
      width: 95%;
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
      justify-content: center;
      flex-wrap: wrap;
      width: 95%;
      .emoji-container {
        position: relative;
        flex: 1;
        .emoji-icon {
          font-size: 1.5rem;
          color: rgb(105, 208, 242);
          cursor: pointer;
        }
        .EmojiPickerReact {
          position: absolute;
          top: -150px;
          left: 50px;
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
        width: 5rem;
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
`;
export default EditPost;
