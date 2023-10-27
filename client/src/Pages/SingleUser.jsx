import { useEffect, useState } from "react";
import styled from "styled-components";
import { Outlet, useParams } from "react-router-dom";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { deactivateUser } from "../features/userSlice";
import { getUserDetailsById, followUnfollowUser } from "../features/userSlice";
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
import { useNavigate } from "react-router-dom";
import {
  MDBBtn,
  MDBCard,
  MDBContainer,
  MDBIcon,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBTooltip,
  MDBModalHeader,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";
import UserLikedPost from "../components/UserLikedPost";
import UserCommentedPost from "../components/UserCommentedPost";
import UserPost from "../components/UserPost";
import {
  getUserCommentedPosts,
  getUserLikedPosts,
  getUserPosts,
} from "../features/postSlice";
const SingleUser = () => {
  const navigate = useNavigate();
  const { user, userIdFromToken, userRoleFromToken } = useContext(UserContext);
  const { userid } = useParams();
  const dispatch = useDispatch();
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [selectedNav, setSelectedNav] = useState("posts");
  const userinfo = useSelector((state) => getUserDetailsById(state, userid));
  const userStatus = useSelector(getAllUsersStatus);
  const userError = useSelector(getUserError);
  useEffect(() => {
    dispatch(getUserPosts(userid));
    dispatch(getUserCommentedPosts(userid));
    dispatch(getUserLikedPosts(userid));
  }, [userid]);
  const handleDeactivateUser = (e) => {
    e.preventDefault();
    setShowConfirmBox(false);
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
  };
  const connectUser = () => {
    dispatch(
      followUnfollowUser({
        details: {
          followerId: userinfo.userid,
          userId: userIdFromToken,
        },
        token: user.accessToken,
      })
    );
  };

  return (
    <Container
      image={
        userinfo?.userCoverPic
          ? userinfo.userCoverPic
          : "https://mdbootstrap.com/img/Photos/Others/images/76.jpg"
      }
    >
      <MDBContainer className="mt-3 d-flex flex-column align-items-center gap-3">
        <Link to="/" className="align-self-start">
          <MDBIcon fas icon="arrow-left" />
          Back
        </Link>
        <MDBCard className="profile-container">
          <div className=" profile-info d-flex align-items-center py-2 px-4 justify-content-between bg-light">
            <div className="d-flex flex-sm-row flex-column align-items-center gap-2">
              <div className="image-container position-relative bg-white border rounded">
                <img
                  src={
                    userinfo.userProfilePic
                      ? userinfo.userProfilePic
                      : "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                  }
                  alt="Avatar"
                  width={100}
                  height={100}
                />
              </div>
              <div className="name d-flex flex-column">
                <div className="d-flex gap-1 align-items-center">
                  <h5 className="mb-0">{userinfo.user_name}</h5>
                  {(userinfo.userid === userIdFromToken ||
                    userRoleFromToken === ROLE.ADMIN ||
                    userinfo.userid === userinfo.deactivatedBy) && (
                    <MDBTooltip
                      tag="a"
                      title={userinfo.isDeactivated ? "Activate" : "Deactivate"}
                    >
                      <MDBIcon
                        style={{ cursor: "pointer" }}
                        fas
                        icon={
                          userinfo.isDeactivated ? "user-alt-slash" : "user-alt"
                        }
                        onClick={() => {
                          setShowConfirmBox(true);
                        }}
                      />
                    </MDBTooltip>
                  )}
                  <p className="m-0" style={{ fontSize: "0.75rem" }}>
                    {userinfo.isDeactivated
                      ? userinfo.deactivatedBy === userinfo.userid
                        ? "🔴  Deactive"
                        : `Account has been deactivated by Administrator`
                      : "🟢  Active"}
                  </p>
                </div>
                <MDBTooltip
                  tag="a"
                  wrapperProps={{ href: "#" }}
                  title={userinfo.userHistory.description}
                >
                  <p
                    className="mb-0"
                    style={{
                      fontSize: "0.8rem",
                      fontStyle: "italic",
                      color: "grey",
                    }}
                  >
                    {userinfo.userHistory.description.slice(0, 20)}
                    {userinfo.userHistory.description.length > 20 ? "..." : ""}
                  </p>
                </MDBTooltip>
                <span className="d-flex align-items-center flex-wrap gap-1">
                  <MDBIcon
                    fas
                    style={{ fontSize: "0.8rem" }}
                    icon="calendar-alt"
                  />
                  <p
                    className="mt-1 mb-0"
                    style={{ fontSize: "0.8rem" }}
                  >{`Joined on - ${format(
                    new Date(userinfo.userHistory.userCreatedAt),
                    "MMM dd,yyy"
                  )}`}</p>
                </span>
                <span className="d-flex align-items-center flex-wrap gap-2">
                  <Link
                    to={`/user/${userinfo.userid}/followers`}
                    style={{ color: "grey" }}
                  >
                    {userinfo.userHistory.followers
                      ? userinfo.userHistory.followers.length
                      : 0}{" "}
                    followers
                  </Link>
                  <Link
                    to={`/user/${userinfo.userid}/following`}
                    style={{ color: "grey" }}
                  >
                    {userinfo.userHistory.followings
                      ? userinfo.userHistory.followings.length
                      : 0}{" "}
                    following
                  </Link>
                </span>
              </div>
            </div>
            {userid === userIdFromToken && (
              <MDBBtn
                color="primary"
                onClick={() => navigate(`/user/${userinfo.userid}/edit`)}
              >
                Edit Profile
              </MDBBtn>
            )}
            {userid !== userIdFromToken && (
              <MDBBtn color="primary" onClick={connectUser}>
                {userinfo?.userHistory?.followers &&
                userinfo?.userHistory?.followers.includes(userIdFromToken)
                  ? "Unfollow"
                  : "Follow"}
              </MDBBtn>
            )}
          </div>
        </MDBCard>
        <>
          <MDBTabs
            fill
            className="mb-3 bg-light tabs"
            style={{ maxWidth: "40rem" }}
          >
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => setSelectedNav("posts")}
                active={selectedNav === "posts"}
              >
                <MDBIcon fas icon="blog" className="me-2" /> Posts
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => setSelectedNav("replies")}
                active={selectedNav === "replies"}
              >
                <MDBIcon fas icon="comment-alt" className="me-2" /> Replies
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => setSelectedNav("likes")}
                active={selectedNav === "likes"}
              >
                <MDBIcon fas icon="heart" className="me-2" /> Likes
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>

          <MDBTabsContent style={{ maxWidth: "40rem" }}>
            <MDBTabsPane show={selectedNav === "posts"}>
              <UserPost userid={userid} userinfo={userinfo} />
            </MDBTabsPane>
            <MDBTabsPane show={selectedNav === "replies"}>
              <UserCommentedPost userid={userid} userinfo={userinfo} />
            </MDBTabsPane>
            <MDBTabsPane show={selectedNav === "likes"}>
              <UserLikedPost userid={userid} userinfo={userinfo} />
            </MDBTabsPane>
          </MDBTabsContent>
        </>
      </MDBContainer>
      <MDBModal
        show={showConfirmBox}
        tabIndex="-1"
        onHide={() => setShowConfirmBox(false)}
      >
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => setShowConfirmBox(false)}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody style={{ fontSize: "1.25rem" }}>
              {`Are you sure you want to ${
                userinfo.isDeactivated ? "activate" : "deactivate"
              } this user?`}
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn
                color="danger"
                onClick={(e) => {
                  e.preventDefault();
                  setShowConfirmBox(false);
                }}
              >
                Cancel
              </MDBBtn>
              <MDBBtn color="success" onClick={handleDeactivateUser}>
                Confirm
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      <Outlet context={{ userinfo }} />
      <ToastContainer />
    </Container>
  );
};
const Container = styled.div`
  .profile-container {
    position: relative;
    width: 40rem;
    height: 20rem;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(${({ image }) => image});
    @media screen and (max-width: 675px) {
      width: 100%;
    }
  }
  .tabs {
    width: 40rem;
    @media screen and (max-width: 675px) {
      width: 100%;
    }
  }
  .profile-info {
    position: absolute;
    bottom: 0;
    max-height: 8rem;
    border-radius: 0.5rem 0.5rem 0 0;
    width: 100%;
    .image-container {
      margin-bottom: 3rem !important;
    }
    @media screen and (max-width: 576px) {
      max-height: 17rem;
      .image-container {
        align-self: flex-start;
        margin-bottom: 0 !important;
      }
    }
    @media screen and (max-width: 384px) {
      flex-direction: column;
      align-items: flex-start !important;
    }
  }
`;
export default SingleUser;
