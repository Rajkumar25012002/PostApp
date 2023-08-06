import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectAllPosts } from "../features/postSlice";
import styled from "styled-components";
import Post from "../components/Post";
import { BiSolidMessageRoundedAdd } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { addComment } from "../features/postSlice";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useContext } from "react";
import { UserContext } from "../App";
import format from "date-fns/format";
const SinglePost = () => {
  const { user, userIdFromToken, userInfo } = useContext(UserContext);
  const [comment, setComment] = useState("");
  const { id } = useParams();
  const dispatch = useDispatch();
  const allPosts = useSelector(selectAllPosts);
  const currentPost = allPosts.find((post) => post.postId === id);
  const handleAddComment = (e) => {
    e.preventDefault();
    dispatch(
      addComment({
        details: {
          postId: id,
          comment: {
            content: comment,
            author: userInfo.user_name,
            authorId: userIdFromToken,
            createdAt: Date.now(),
          },
        },
        token: user.accessToken,
      })
    );
    setComment("");
  };
  return (
    <Container>
      <Link to="/">
        <IoArrowBackCircleSharp className="back" size="2rem" />
      </Link>
      <div className="single-post">
        {currentPost && <Post post={currentPost} />}
        <div className="comment-area">
          <span>
            <textarea
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add your comment here..."
            ></textarea>
            <BiSolidMessageRoundedAdd onClick={handleAddComment} size="2rem" />
          </span>
          <div className="section">
            {currentPost?.comments.map((comment, index) => {
              return (
                <div className="comment-box" key={index}>
                  <FaUserCircle size="1.5rem" />
                  <div className="comment-detail">
                    <span>
                      <p className="user">{comment.author}</p>
                      {currentPost.comments && (
                        <p className="date">
                          {format(
                            new Date(comment.createdAt),
                            "MMM d, yyy hh:mm a"
                          )}
                        </p>
                      )}
                    </span>
                    <p className="replying-to">{`Replying to @${currentPost.userName}`}</p>
                    <p className="content">{comment.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  margin: 2rem;
  overflow-y: auto;
  gap: 0.5rem;
  .back {
    transition: 0.2s ease-in-out;
    &:hover {
      color: rgb(58, 231, 102);
      transform: scale(1.05) translateX(-5px);
    }
  }
  .single-post {
    display: flex;
    flex-direction: column;
    align-self: center;
    width: 70%;
    .post {
      display: flex;
      flex-direction: column;
      padding: 0.5rem;
      height: max-content;
      border-radius: 0.25rem;
      color: var(--text-normal);
      border: 1px solid rgb(182, 182, 182);
      .post-header {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        .username {
          font-weight: 600;
          color: var(--text-header);
          font-size: large;
        }
        .time {
          font-style: italic;
        }
      }
      .post-title {
        margin: 0;
        font-weight: 600;
      }
      .post-content {
        margin: 0;
        font-family: var(--font-family);
      }
      .date-time {
        margin-bottom: 0;
        font-size: small;
      }
      .post-feedback {
        display: flex;
        align-items: center;
        gap: 1rem;
        height: max-content;
        border-radius: 0.25rem;
      }
    }
    .comment-area {
      display: flex;
      flex-direction: column;
      padding: 0.5rem;
      justify-content: center;
      gap: 0.5rem;
      span {
        display: flex;
        gap: 0.25rem;
        justify-content: space-around;
        align-items: center;
        textarea {
          width: 90%;
          outline: none;
          border: none;
          border: 1px solid rgb(182, 182, 182);
          border-radius: 0.5rem;
          padding: 0.5rem;
        }
        svg {
          color: var(--button);
          transition: 0.1s ease-in-out;
          &:hover {
            color: rgb(36, 164, 249);
            transform: scale(1.05);
          }
        }
      }
      .section {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.5rem;
        gap: 0.5rem;
        height: 24em;
        overflow-y: auto;
        &::-webkit-scrollbar {
          width: 0.5rem;
          &-thumb {
            background-color: rgb(105, 242, 158);
            width: 0.1rem;
            border-radius: 1rem;
          }
        }
        .comment-box {
          display: flex;
          gap: 0.5rem;
          padding: 0.5rem;
          margin: 0;
          width: 95%;
          border-radius: 0.5rem;
          border: 1px solid rgb(182, 182, 182);
          .comment-detail {
            display: flex;
            width: 50%;
            flex-direction: column;
            p {
              margin: 0;
            }
            span {
              display: flex;
              justify-content: flex-start;
              margin: 0;
              .user {
                font-weight: 600;
                font-size: medium;
              }
              .date {
                font-size: small;
                color: var(--text-normal);
              }
            }
            .replying-to {
              font-size: small;
              color: var(--text-normal);
            }
          }
        }
      }
    }
  }
`;
export default SinglePost;
