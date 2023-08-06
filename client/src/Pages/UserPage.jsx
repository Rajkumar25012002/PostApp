import React from "react";
import styled from "styled-components";
import { FaUserCircle, FaUserEdit, FaUserSlash } from "react-icons/fa";
import { FcDownRight } from "react-icons/fc";
import { selectAllUsers } from "../features/userSlice";
import EditUser from "../components/EditUser";
import {
  selectPostByUserId,
  getAllLikedPostsByUser,
  getAllCommentedPostsByUserId,
} from "../features/postSlice";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import Post from "../components/Post";
import {
  getUserError,
  getAllUsersStatus,
  getUserNameById,
} from "../features/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  toastOptionError,
  toastOptionSuccess,
} from "../components/utils/toastOptions";
import { deactivateUser } from "../features/userSlice";
import ROLE from "../components/utils/USERROLE.js";
import { useDispatch } from "react-redux";
import { useContext } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router";
import robot from "../assets/robot.gif";
const UserPage = () => {
  const navigate = useNavigate();

  const { user } = useContext(UserContext);
  const allUsers = useSelector(selectAllUsers);
  const [searchUser, setSearchUser] = useState("");
  const [selectedUserId, setSelectedUserId] = useState();
  let selectedUserDetails = allUsers.find(
    (user) => user.userid === selectedUserId
  );
  const filteredUsers =
    searchUser === null
      ? allUsers
      : allUsers.filter((user) => user.user_name.includes(searchUser));
  const userCardList = filteredUsers.map((user, index) => {
    return (
      <div
        key={index}
        onClick={() => setSelectedUserId(user.userid)}
        className={`user-card ${user.userid === selectedUserId && "selected"}`}
      >
        <FaUserCircle size="2rem" />
        <p className="username">{user.user_name}</p>
      </div>
    );
  });
  useEffect(() => {
    if (user.accessToken === undefined) {
      navigate("/login");
    }
  }, [user]);

  return (
    <Container>
      <div className="user-search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for a user"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
        </div>
        <div className="user-card-list">{userCardList}</div>
      </div>
      {selectedUserDetails && (
        <SingleUserDisplay userinfo={selectedUserDetails} />
      )}
      {!selectedUserDetails && (
        <div className="robot">
          <img src={robot} alt="robot"></img>
        </div>
      )}
    </Container>
  );
};
const SingleUserDisplay = ({ userinfo }) => {
  const [showUserEditor, setShowUserEditor] = useState(false);
  const [selectedNav, setSelectedNav] = useState("posts");
  const dispatch = useDispatch();
  const { user, userIdFromToken, userRoleFromToken } = useContext(UserContext);
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

  const selectUserLikedPosts = useSelector((state) =>
    getAllLikedPostsByUser(state, userinfo.userid)
  );
  const selectUserPost = useSelector((state) =>
    selectPostByUserId(state, userinfo.userid)
  );
  const selectCommentedPosts = useSelector((state) =>
    getAllCommentedPostsByUserId(state, userinfo.userid)
  );
  const userPostDetails = selectUserPost.map((post, index) => {
    return <Post post={post} key={index} />;
  });
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
          <div key={index}>
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
          </div>
        );
      })
    ) : (
      <div className="nopost">You have not commented on any post yet</div>
    );
  return (
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
        <p className="user-mail">{userinfo?.email}</p>
        <p className="user-description">
          {userinfo?.userHistory.description
            ? userinfo.userHistory.description
            : "Hello"}
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
      {showUserEditor && userinfo?.userid && (
        <EditUser onClose={setShowUserEditor} userinfo={userinfo} />
      )}
      <ToastContainer />
    </div>
  );
};
const Container = styled.div`
  display: grid;
  grid-template-columns: 25% 75%;
  padding: 1rem;
  height: 84vh;
  margin: 1rem;
  border-radius: 0.25rem;
  border: 1px solid rgb(182, 182, 182);
  .user-search-section {
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid rgb(182, 182, 182);
    .search-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.25rem;
      input {
        padding: 0.5rem;
        border-radius: 0.5rem;
        width: 100%;
        border: none;
        outline: none;
        border: 1px solid rgb(182, 182, 182);
      }
    }
    .user-card-list {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 35rem;
      padding: 0.25rem;
      border-radius: 0.25rem;
      overflow-y: auto;
      gap: 0.5rem;
      &::-webkit-scrollbar {
        width: 0.35rem;
        &-thumb {
          background-color: rgb(105, 242, 158);
          width: 0.1rem;
          border-radius: 1rem;
        }
      }
      .user-card {
        display: flex;
        gap: 1rem;
        padding: 0.5rem;
        width: 90%;
        flex-wrap: wrap;
        align-items: center;
        border-radius: 1rem;
        border: 1px solid rgb(182, 182, 182);
        cursor: pointer;
        transition: 0.3s ease-in-out;
        &.selected {
          background-color: #d3f5f5;
        }
        &:hover {
          transform: scale(1.05);
        }
        svg {
          color: var(--button);
        }
        .username {
          margin: 0;
          font-weight: 600;
          font-size: large;
        }
      }
    }
  }
  .robot {
    display: flex;
    background-color: #000000c5;
    justify-content: center;
  }
  .user-display {
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    gap: 0.5rem;
    margin: 0 1rem;
    border-radius: 0.25rem;
    border: 1px solid rgb(182, 182, 182);
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.35rem;
      &-thumb {
        background-color: rgb(105, 242, 158);
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
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
      .user-mail,
      .user-description {
        font-family: Georgia, "Times New Roman", Times, serif;
      }
    }
    .user-detail-history {
      display: flex;
      flex-direction: column;
      padding: 0.5rem;
      gap: 1rem;
      border: 1px solid rgb(182, 182, 182);
      border-radius: 0.25rem;
      nav {
        display: flex;
        justify-content: space-around;
        align-items: center;
        position: sticky;
        background-color: rgb(255, 255, 255);
        top: -0.5rem;
        z-index: 1;
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
        /* border: rgb(182, 182, 182) solid 1px; */
        padding: 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
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
          padding: 0.5rem;
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
export default UserPage;
