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
import { useOutletContext } from "react-router";
import { useNavigate } from "react-router";
import {
  MDBInput,
  MDBBtnGroup,
  MDBRadio,
  MDBTextArea,
  MDBModalTitle,
  MDBModalHeader,
  MDBModal,
  MDBModalBody,
  MDBModalContent,
  MDBBtn,
  MDBModalDialog,
  MDBCard,
} from "mdb-react-ui-kit";
function EditUser() {
  const navigate = useNavigate();
  const { user, userRoleFromToken, userIdFromToken } = useContext(UserContext);
  const { userinfo } = useOutletContext();
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
    if (e.target.name === "description") {
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
  };
  const changeProfilePic = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      dispatch(
        updatedUser({
          details: {
            userid: userIdFromToken,
            userProfilePic: reader.result,
          },
          token: user.accessToken,
        })
      );
      if (userStatus === "fulfilled") {
        toast.success("Profile pic updated successfully", toastOptionSuccess);
      } else {
        toast.error(userError, toastOptionError);
      }
    };
  };
  const changeCoverPic = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      dispatch(
        updatedUser({
          details: {
            userid: userIdFromToken,
            userCoverPic: reader.result,
          },
          token: user.accessToken,
        })
      );
      if (userStatus === "fulfilled") {
        toast.success("Cover pic updated successfully", toastOptionSuccess);
      } else {
        toast.error(userError, toastOptionError);
      }
    };
  };
  return (
    <Container>
      <MDBModal show={true} tabIndex="-1" onHide={() => navigate(-1)}>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Profile</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => navigate(-1)}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody className="d-flex flex-column gap-3">
              <MDBCard
                style={{ height: "5rem" }}
                className="position-relative mb-5"
              >
                <label htmlFor="coverPic">
                  <img
                    className="bg-pic position-absolute rounded"
                    src={
                      userinfo.userCoverPic
                        ? userinfo.userCoverPic
                        : "https://mdbootstrap.com/img/Photos/Others/images/76.jpg"
                    }
                    alt="Background"
                    style={{
                      width: "100%",
                      height: "100%",
                      cursor: "pointer",
                      objectFit: "cover",
                    }}
                  />
                </label>
                <input
                  type="file"
                  onChange={changeCoverPic}
                  id="coverPic"
                  accept="image/*"
                  max={1}
                />
                <label htmlFor="profilePic">
                  <img
                    src={
                      userinfo.userProfilePic
                        ? userinfo.userProfilePic
                        : "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                    }
                    className="profile-pic position-absolute rounded-circle"
                    alt="Avatar"
                    style={{
                      width: "5rem",
                      height: "5rem",
                      bottom: "-2rem",
                      left: "1rem",
                      cursor: "pointer",
                      zIndex: "10",
                    }}
                  />
                </label>
                <input
                  type="file"
                  onChange={changeProfilePic}
                  id="profilePic"
                  max={1}
                  accept="image/*"
                />
              </MDBCard>
              <MDBInput
                label="Username"
                icon="user"
                disabled
                type="text"
                value={username}
                onChange={handleChange}
                name="username"
                required
              />
              <MDBInput
                label="Email"
                icon="user"
                type="email"
                value={email}
                onChange={handleChange}
                name="email"
                required
              />
              {userRoleFromToken === ROLE.ADMIN &&
                userinfo.userid === userIdFromToken && (
                  <MDBBtnGroup style={{ width: "max-content" }}>
                    {Object.values(ROLE).map((value, index) => {
                      return (
                        <MDBRadio
                          key={value}
                          btn
                          btnColor="secondary"
                          id={`btn-radio${index + 1}`}
                          name="role"
                          checked={userrole === value}
                          value={value}
                          onChange={(e) => setUserrole(e.target.value)}
                          wrapperTag="span"
                          label={value}
                        />
                      );
                    })}
                  </MDBBtnGroup>
                )}
              <MDBTextArea
                label="Description"
                value={description}
                onChange={handleChange}
                name="description"
              />
              <MDBBtn onClick={handleSubmit}>Update</MDBBtn>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      <ToastContainer />
    </Container>
  );
}

const Container = styled.div``;

export default EditUser;
