import React from "react";
import { parseISO, formatDistanceToNow } from "date-fns";
import { addEmoji, retweetedPost } from "../features/postSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";
import {
  getUserNameById,
  selectAllUsers,
  getUserProfilePicById,
} from "../features/userSlice";
import styled from "styled-components";
import { useSelector } from "react-redux/es/hooks/useSelector";
import ROLE from "./utils/USERROLE.js";
import defaultUserPic from "../assets/user.png";
import {
  MDBCard,
  MDBCardTitle,
  MDBCardText,
  MDBCardFooter,
  MDBIcon,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCardLink,
} from "mdb-react-ui-kit";
let Post = ({ post }) => {
  const navigate = useNavigate();
  const { user, userIdFromToken, userRoleFromToken } = useContext(UserContext);
  const userName = useSelector((state) => getUserNameById(state, post.userid));
  const userProfilePic = useSelector((state) =>
    getUserProfilePicById(state, post.userid)
  );
  const dispatch = useDispatch();
  let mentionedUsers = useSelector(selectAllUsers)
    .filter((user) => post.mentions.includes(user.user_name))
    .map((user) => {
      return { userName: user.user_name, userId: user.userid };
    });
  const retweetedUserName = useSelector((state) =>
    getUserNameById(state, post.retweetedBy)
  );
  const formattedDate =
    post.datePosted && formatDistanceToNow(parseISO(post.datePosted));
  const addLikeForPost = () => {
    dispatch(
      addEmoji({
        details: {
          postId: post.postId,
          feed: "likes",
          userid: userIdFromToken,
        },
        token: user.accessToken,
      })
    );
  };
  const retweetForPost = () => {
    dispatch(
      retweetedPost({
        details: {
          postId: post.postId,
          userid: post.userid,
          title: post.title,
          content: post.content,
          link: post.link,
          images: post.images,
          mentions: post.mentions,
          isRetweet: true,
          datePosted: new Date().toISOString(),
          retweetedBy: userIdFromToken,
        },
        token: user.accessToken,
      })
    );
  };
  return (
    <Container>
      <MDBCard className="post p-2 mb-1 shadow-5">
        {post.isRetweet && (
          <MDBCardTitle className="d-flex align-items-center  small gap-2 mx-4">
            <MDBIcon fas size="sm" icon="retweet" />
            <Link to={`/user/${post.retweetedBy}`}>
              <MDBCardText
                className="m-0"
                style={{ fontSize: "0.75rem", fontStyle: "italic" }}
              >
                {post.retweetedBy === userIdFromToken
                  ? " You "
                  : retweetedUserName}{" "}
                Retweeted
              </MDBCardText>
            </Link>
          </MDBCardTitle>
        )}
        <div className="d-flex gap-2">
          <Link to={`/user/${post.userid}`}>
            <img
              src={userProfilePic ? userProfilePic : defaultUserPic}
              alt="img"
              width={35}
              height={35}
              className="rounded-circle"
            />
          </Link>
          <div className="d-flex flex-column w-100">
            <MDBCardTitle className="m-0 mb-2">
              <MDBCardText className="m-0">
                {userName}
                {(post.userid === userIdFromToken ||
                  userRoleFromToken === ROLE.ADMIN ||
                  userRoleFromToken === ROLE.EDITOR) &&
                  !post.isRetweet && (
                    <Link to={`/edit/post/${post.postId}`}>
                      <MDBIcon className="mx-5" size="sm" fas icon="pen" />
                    </Link>
                  )}
              </MDBCardText>
              <MDBCardText
                className="m-0 fw-normal"
                style={{ fontSize: "0.75rem" }}
              >{`${formattedDate} ago`}</MDBCardText>
            </MDBCardTitle>
            <Link to={`/post/${post.postId}`}>
              <MDBCardText className="m-0">{post.content}</MDBCardText>
              {post.images && (
                <MDBContainer className="m-1">
                  <MDBRow className="g-1">
                    {post.images.map((image, index) => (
                      <MDBCol md="6" key={index}>
                        <img src={image} alt={"image"} className="img-fluid" />
                      </MDBCol>
                    ))}
                  </MDBRow>
                </MDBContainer>
              )}
              <MDBCardText className="m-0">#{post.title}</MDBCardText>
            </Link>
            {post.link && (
              <MDBCardLink
                href={post.link}
                target="_blank"
                className="postlink"
              >
                <MDBIcon size="sm" fas icon="link" />
                {post.link}
              </MDBCardLink>
            )}
            {mentionedUsers && (
              <div className="d-flex gap-1 flex-wrap">
                {mentionedUsers.map((user, index) => (
                  <MDBCardLink
                    key={index}
                    className="mentions m-0"
                    onClick={() => navigate("/user/" + user.userId)}
                  >
                    @{user.userName.toLowerCase()}
                  </MDBCardLink>
                ))}
              </div>
            )}
            <MDBCardFooter border="0" className="d-flex gap-5 p-0 py-2">
              <span>
                <MDBIcon
                  fas
                  icon="heart"
                  style={{
                    color:
                      post && post.likes.includes(userIdFromToken)
                        ? "red"
                        : "rgb(173, 173, 173)",
                  }}
                  onClick={addLikeForPost}
                />
                {post.likes.length}
              </span>
              {post.comments !== undefined && (
                <span>
                  <MDBIcon fas icon="comment" />
                  {post.comments.length}
                </span>
              )}
              <span>
                <MDBIcon
                  fas
                  icon="share"
                  style={{
                    color: post.shares.includes(userIdFromToken)
                      ? "rgb(7, 119, 255)"
                      : "rgb(173, 173, 173)",
                  }}
                  onClick={retweetForPost}
                />
                {post.shares.length}
              </span>
              <span>
                <MDBIcon fas icon="bookmark" />
              </span>
            </MDBCardFooter>
          </div>
        </div>
      </MDBCard>
    </Container>
  );
};

Post = React.memo(Post);
const Container = styled.div`
  & > .post {
    width: 40rem;
    a {
      color: black;
    }
    i {
      cursor: pointer;
    }
    .postlink,
    .mentions {
      cursor: pointer;
      color: rgb(2, 84, 183) !important;
      &:hover {
        text-decoration: underline !important;
      }
    }
    .img-fluid {
      width: 100%;
      height: 10rem;
      border-radius: 0.25rem;
      object-fit: cover;
    }
    margin: auto;
    @media screen and (max-width: 675px) {
      width: 100%;
    }
  }
`;
export default Post;
