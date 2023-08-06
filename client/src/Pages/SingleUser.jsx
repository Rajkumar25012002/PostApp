import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Post from "../components/Post";
import { useParams } from "react-router-dom";
import { FaUserCircle, FaUserEdit, FaUserSlash } from "react-icons/fa";
import { FcDownRight } from "react-icons/fc";
import { format } from "date-fns";
import EditUser from "../components/EditUser";
import { useSelector } from "react-redux";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import {
  selectPostByUserId,
  getAllLikedPostsByUser,
  getAllCommentedPostsByUserId,
} from "../features/postSlice";
import { deactivateUser } from "../features/userSlice";
import { getUserDetailsById } from "../features/userSlice";
import { useContext } from "react";
import { UserContext } from "../App";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ROLE from "../components/utils/USERROLE.js";
import { getUserError, getAllUsersStatus } from "../features/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  toastOptionError,
  toastOptionSuccess,
} from "../components/utils/toastOptions";
const SingleUser = () => {
  const { user, userIdFromToken, userRoleFromToken } = useContext(UserContext);
  const { userid } = useParams();
  const dispatch = useDispatch();
  const [showUserEditor, setShowUserEditor] = useState(false);
  const [selectedNav, setSelectedNav] = useState("posts");
  const userinfo = useSelector((state) => getUserDetailsById(state, userid));

  const selectUserLikedPosts = useSelector((state) =>
    getAllLikedPostsByUser(state, userinfo?.userid)
  );
  const selectUserPost = useSelector((state) =>
    selectPostByUserId(state, userinfo?.userid)
  );
  const selectCommentedPosts = useSelector((state) =>
    getAllCommentedPostsByUserId(state, userinfo?.userid)
  );
  const userPostDetails = selectUserPost.map((post, index) => {
    return <Post post={post} key={index} />;
  });
  const userStatus = useSelector(getAllUsersStatus);
  const userError = useSelector(getUserError);
  const handleDeactivateUser = () => {
    if (
      window.confirm(
        `Are you sure you want to ${
          userinfo.isDeactivated ? "activate" : "deactivate"
        } this user?`
      )
    ) {
      dispatch(
        deactivateUser({
          details: {
            userid: userinfo.userid,
            deactivatedBy: userIdFromToken,
          },
          token: user.accessToken,
        })
      );
      if (userStatus === "rejected") {
        toast.error(userError, toastOptionError);
      } else if (!userinfo.isDeactivated) {
        toast.success("User deactivated Successfully", toastOptionSuccess);
      } else {
        toast.success("User activated Successfully", toastOptionSuccess);
      }
    }
  };
  useEffect(() => {
    if (userStatus === "rejected") {
      toast.error(userError, toastOptionError);
    }
    if (userStatus === "updated") {
      toast.success("User updated Successfully", toastOptionSuccess);
    }
  }, [userStatus]);
  const userLikedPosts =
    selectUserLikedPosts.length > 0 ? (
      selectUserLikedPosts.map((post, index) => {
        return <Post post={post} key={index} />;
      })
    ) : (
      <div className="nopost">You have not liked any post yet</div>
    );
  const userCommentedPosts =
    selectCommentedPosts.length > 0 ? (
      selectCommentedPosts.map((post, index) => {
        return (
          <>
            <Post post={post} key={index} />
            {post.comments.map((comment, index) => {
              if (comment.authorId === userinfo.userid) {
                return (
                  <div key={index} className="comment-container">
                    <FcDownRight size={"3rem"} />
                    <div className="comment-box">
                      <FaUserCircle size="1.5rem" />
                      <div className="comment-detail">
                        <span>
                          <p className="user">{comment.author}</p>
                          <p className="date">
                            {format(
                              new Date(comment.createdAt),
                              "MMM d, yyy hh:mm a"
                            )}
                          </p>
                        </span>
                        <p className="replying-to">{`Replying to @${post.userName}`}</p>
                        <p className="content">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </>
        );
      })
    ) : (
      <div className="nopost">You have not commented on any post yet</div>
    );
  if (!userinfo?.user_name) {
    return <div>Loading...</div>;
  }
  return (
    <Container>
      <Link to="/">
        <IoArrowBackCircleSharp className="back" size="2rem" />
      </Link>
      <div className="user-display">
        <div className="header">
          <FaUserCircle size="4rem" />
          <p className="username">{userinfo.user_name}</p>
          {(userinfo.userid === userIdFromToken ||
            userRoleFromToken === ROLE.ADMIN) && (
            <FaUserEdit
              className="edit-icon"
              onClick={() => setShowUserEditor(true)}
              size="1.5rem"
            />
          )}
          {((userinfo.userid === userIdFromToken && !userinfo.isDeactivated) ||
            userRoleFromToken === ROLE.ADMIN ||
            (userinfo.isDeactivated &&
              userinfo.userid === userinfo.deactivatedBy)) && (
            <FaUserSlash
              className="delete-icon"
              onClick={handleDeactivateUser}
              size="1.5rem"
            />
          )}
          <p className="active-status">
            {userinfo.isDeactivated
              ? userinfo.deactivatedBy === userinfo.userid
                ? "🔴  Activate your account to view details"
                : `Account has been deactivated by Administrator`
              : "🟢  Active"}
          </p>
        </div>
        <div className="user-info">
          <p className="user-role">{userinfo.userRole}</p>
          <p className="user-description">
            {userinfo?.userDescription ? userinfo.userDescription : "Hello"}
          </p>
          <p className="user-date">{`Joined on - ${format(
            new Date(userinfo.userHistory.userCreatedAt),
            "MMM dd,yyy"
          )}`}</p>
        </div>
        <div className="user-detail-history">
          <nav>
            <button
              className={selectedNav === "posts" ? "selected-btn" : ""}
              onClick={() => setSelectedNav("posts")}
            >
              Posts
            </button>
            <button
              className={selectedNav === "replies" ? "selected-btn" : ""}
              onClick={() => setSelectedNav("replies")}
            >
              Replies
            </button>
            <button
              className={selectedNav === "likes" ? "selected-btn" : ""}
              onClick={() => setSelectedNav("likes")}
            >
              Likes
            </button>
          </nav>
          <div className="selected-content">
            {selectedNav === "posts"
              ? userPostDetails
              : selectedNav === "likes"
              ? userLikedPosts
              : userCommentedPosts}
          </div>
        </div>
      </div>
      {showUserEditor && userinfo?.userid && (
        <EditUser onClose={setShowUserEditor} userinfo={userinfo} />
      )}
      <ToastContainer />
    </Container>
  );
};
const Container = styled.div`
  padding: 2rem;
  .back {
    transition: 0.2s ease-in-out;
    &:hover {
      color: rgb(58, 231, 102);
      transform: scale(1.05) translateX(-5px);
    }
  }
  .user-display {
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    gap: 0.5rem;
    margin: 0 1rem;
    border-radius: 0.25rem;
    border: 1px solid rgb(182, 182, 182);

    .header {
      display: flex;
      padding: 0.5rem;
      gap: 1rem;
      align-items: center;
      svg {
        color: var(--button);
      }
      .username {
        margin: 0;
        font-weight: 700;
        font-size: 25px;
      }
      .edit-icon {
        text-align: right;
        cursor: pointer;
        color: #969696;
        transition: 0.3s ease-in-out;
        &:hover {
          transform: scale(1.1);
          color: rgb(7, 119, 255);
        }
      }
      .delete-icon {
        text-align: right;
        cursor: pointer;
        color: #969696;
        transition: 0.3s ease-in-out;
        &:hover {
          transform: scale(1.1);
          color: rgb(255, 48, 7);
        }
      }
      .active-status {
        justify-self: flex-end;
      }
    }
    .user-info {
      display: flex;
      flex-direction: column;
      padding: 0.5rem;
      p {
        margin: 0;
      }
      .user-role {
        font-weight: 700;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      }
      .user-date {
        font-family: Georgia, "Times New Roman", Times, serif;
      }
      .user-description {
        font-family: Georgia, "Times New Roman", Times, serif;
      }
    }
    .user-detail-history {
      display: flex;
      flex-direction: column;
      padding: 0.5rem;
      gap: 1rem;
      border-radius: 0.25rem;
      nav {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 0.25rem;
        button {
          margin: 0;
          padding: 0.5rem;
          outline: none;
          border: none;
          cursor: pointer;
          font-weight: 600;
          background-color: var(--button);
          border-radius: 0.5rem;
          transition: 0.2s ease-in-out;
          &:hover {
            background-color: rgb(14, 231, 97);
          }
          &.selected-btn {
            background-color: rgb(14, 231, 97);
          }
        }
      }
      .selected-content {
        border: rgb(182, 182, 182) solid 1px;
        padding: 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        overflow: auto;
        height: 20rem;
        &::-webkit-scrollbar {
          width: 0.35rem;
          &-thumb {
            background-color: rgb(105, 242, 158);
            width: 0.1rem;
            border-radius: 1rem;
          }
        }
        .nopost {
          display: flex;
          margin: auto;
          font-family: Georgia, "Times New Roman", Times, serif;
          font-size: large;
          align-self: center;
        }
        .comment-container {
          display: flex;
          justify-content: space-evenly;
          .comment-box {
            display: flex;
            gap: 0.5rem;
            padding: 0.5rem;
            margin: 0;
            width: 85%;
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
                align-items: center;
                gap: 1rem;
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
  }
`;
export default SingleUser;
