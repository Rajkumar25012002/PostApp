import React from "react";
import formatDate from "./utils/DateTime";
import { parseISO, formatDistanceToNow } from "date-fns";
import { FaUserCircle, FaComment, FaShare, FaEdit } from "react-icons/fa";
import { AiFillDislike, AiFillHeart } from "react-icons/ai";
import { addEmoji, retweetedPost } from "../features/postSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";
import { getUserNameById } from "../features/userSlice";
import styled from "styled-components";
import { useSelector } from "react-redux/es/hooks/useSelector";
import ROLE from "./utils/USERROLE.js";
let Post = ({ post }) => {
  const { user, userIdFromToken, userRoleFromToken } = useContext(UserContext);
  const userName = useSelector((state) => getUserNameById(state, post.userid));
  const dispatch = useDispatch();
  const retweetedUserName = useSelector((state) =>
    getUserNameById(state, post.retweetedBy)
  );
  const formattedDate =
    post.datePosted && formatDistanceToNow(parseISO(post.datePosted));
  return (
    <Container>
      <div className="post">
        {post.isRetweet && (
          <p className="retweetBy">
            <FaShare color="rgb(96, 177, 2)" size="1rem"></FaShare>
            <Link to={`/user/${post.retweetedBy}`}>
              {post.retweetedBy === userIdFromToken
                ? " You "
                : retweetedUserName}{" "}
              Retweeted
            </Link>
          </p>
        )}
        <div className="post-header">
          <Link to={`/user/${post.userid}`}>
            <FaUserCircle size="2rem" />
          </Link>
          <p className="username">{userName}</p>
          <p className="time">{`${formattedDate} ago`}</p>
          {(post.userid === userIdFromToken ||
            userRoleFromToken === ROLE.ADMIN ||
            userRoleFromToken === ROLE.EDITOR) &&
            !post.isRetweet && (
              <Link to={`/edit/post/${post.postId}`}>
                <FaEdit className="editicon" size="1rem" />
              </Link>
            )}
        </div>
        <Link to={`/post/${post.postId}`}>
          <p className="post-title">{post.title}</p>
          <p className="post-content">{post.content}</p>
          {post.datePosted && (
            <p className="date-time">
              {formatDate(parseISO(post.datePosted).toLocaleString())}
            </p>
          )}
        </Link>
        <div className="post-feedback">
          <span>
            <AiFillHeart
              color={
                post.likes.includes(userIdFromToken)
                  ? "red"
                  : "rgb(173, 173, 173)"
              }
              onClick={() =>
                dispatch(
                  addEmoji({
                    details: {
                      postId: post.postId,
                      feed: "likes",
                      userid: userIdFromToken,
                    },
                    token: user.accessToken,
                  })
                )
              }
            />
            {post.likes.length}
          </span>
          <span>
            <AiFillDislike
              color={
                post.dislikes.includes(userIdFromToken)
                  ? "rgb(70, 61, 60)"
                  : "rgb(173, 173, 173)"
              }
              onClick={() =>
                dispatch(
                  addEmoji({
                    details: {
                      postId: post.postId,
                      feed: "dislikes",
                      userid: userIdFromToken,
                    },
                    token: user.accessToken,
                  })
                )
              }
            />
            {post.dislikes.length}
          </span>
          {post.comments !== undefined && (
            <span>
              <FaComment />
              {post.comments.length}
            </span>
          )}
          <span>
            <FaShare
              color={
                post.shares.includes(userIdFromToken)
                  ? "rgb(7, 119, 255)"
                  : "rgb(173, 173, 173)"
              }
              onClick={() =>
                dispatch(
                  retweetedPost({
                    details: {
                      postId: post.postId,
                      userid: post.userid,
                      title: post.title,
                      content: post.content,
                      datePosted: new Date().toISOString(),
                      retweetedBy: userIdFromToken,
                    },
                    token: user.accessToken,
                  })
                )
              }
            />
            {post.shares.length}
          </span>
        </div>
      </div>
    </Container>
  );
};
Post = React.memo(Post);
const Container = styled.div`
  .post {
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    height: max-content;
    border-radius: 0.25rem;
    color: var(--text-normal);
    border: 1px solid rgb(182, 182, 182);
    .retweetBy {
      margin: 0;
      font-size: 0.75rem;
      font-style: italic;
    }
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
      .editicon {
        color: "rgb(173, 173, 173)";
        transition: 0.2s ease-in-out;
        &:hover {
          color: rgb(7, 119, 255);
          transform: scale(1.1);
        }
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
      cursor: pointer;
      gap: 1rem;
    }
  }
`;
export default Post;
