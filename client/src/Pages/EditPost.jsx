import { useNavigate } from "react-router-dom";
import { useState, useRef, useContext } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  toastOptionError,
  toastOptionSuccess,
} from "../components/utils/toastOptions";
import styled from "styled-components";
import { UserContext } from "../App";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBTooltip,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBTextArea,
  MDBIcon,
} from "mdb-react-ui-kit";
import Select from "react-select";
import Picker from "emoji-picker-react";
import {
  getPostById,
  getStateErr,
  getStateStatus,
  updatePost,
  deletePost,
} from "../features/postSlice";
import { useSelector } from "react-redux";
import { selectAllUsers } from "../features/userSlice";
import SelectVisibility from "../InputElements/SelectVisibility";
export default function EditPost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectRef = useRef();
  const { user, userIdFromToken } = useContext(UserContext);
  const postStatus = useSelector(getStateStatus);
  const postErr = useSelector(getStateErr);
  const postDetails = useSelector((state) =>
    getPostById(state, window.location.pathname.split("/")[3])
  );
  const [currentPost, setCurrentPost] = useState({
    tag: postDetails.title,
    content: postDetails.content,
    link: postDetails.link,
    mentions: postDetails.mentions,
    images: postDetails.images,
    visibility: postDetails.visibility,
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const allUsers = useSelector(selectAllUsers).map((user) => {
    return { value: user.user_name, label: user.user_name };
  });
  const closeModel = () => {
    navigate(-1);
  };
  const visibilityOptions = [
    { value: "Public", label: "Public", icon: "globe" },
    { value: "Private", label: "Private", icon: "lock" },
    { value: "Circle", label: "Circle", icon: "user-friends" },
  ];
  const updatePoster = (e) => {
    e.preventDefault();
    if (currentPost.tag && currentPost.content) {
      dispatch(
        updatePost({
          details: {
            postId: postDetails.postId,
            title: currentPost.tag,
            content: currentPost.content,
            images: currentPost.images,
            updatedDate: new Date().toISOString(),
            mentions: currentPost.mentions,
            link: currentPost.link,
            visibility: currentPost.visibility,
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
  const handleChange = (e) => {
    setCurrentPost({
      ...currentPost,
      [e.target.name]: e.target.value,
    });
  };
  const handleEmojiClick = (emoji) => {
    let msg = currentPost.content;
    msg += emoji.emoji;
    setCurrentPost({
      ...currentPost,
      content: msg,
    });
  };
  const handleMentions = (e) => {
    setCurrentPost({
      ...currentPost,
      mentions: e.map((option) => option.value),
    });
  };
  const updateImageForPost = (e) => {
    const files = e.target.files;
    const updatedImages = [...currentPost.images];
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updatedImages.push(event.target.result);
        setCurrentPost({
          ...currentPost,
          images: updatedImages,
        });
      };
      reader.readAsDataURL(files[i]);
    }
  };

  const removeImage = (e, index) => {
    e.preventDefault();
    setCurrentPost({
      ...currentPost,
      images: currentPost.images.filter((_, i) => i !== index),
    });
  };
  const deletePoster = (e) => {
    const postId = postDetails.postId;
    e.preventDefault();
    if (postId !== null && postId) {
      dispatch(
        deletePost({
          details: {
            editor: userIdFromToken,
            postId: postId,
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
  return (
    <Container>
      <MDBModal show={true} tabIndex="-1" onHide={() => navigate(-1)}>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Edit Post</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={closeModel}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              {postDetails && (
                <MDBContainer className=" p-3 border post-container">
                  <div className="d-flex flex-column gap-2">
                    <form className="d-flex flex-column gap-3">
                      <div
                        className="visibility-container d-flex align-items-center border"
                        style={{ borderRadius: "1.5rem", width: "max-content" }}
                      >
                        <MDBIcon
                          style={{ paddingLeft: "1rem", width: "2.15rem" }}
                          fas
                          icon={
                            visibilityOptions.filter(
                              (option) =>
                                option.value === currentPost.visibility
                            )[0].icon
                          }
                        />
                        <SelectVisibility
                          options={visibilityOptions}
                          post={currentPost}
                          setPost={setCurrentPost}
                        />
                      </div>
                      <MDBTextArea
                        label="Content"
                        id="textAreaExample"
                        rows={4}
                        name="content"
                        onClick={() => setShowEmojiPicker(false)}
                        onChange={handleChange}
                        value={currentPost.content}
                      />
                      <MDBInput
                        size="md"
                        className=""
                        type="text"
                        id="form1Example2"
                        label="Add tag"
                        name="tag"
                        onChange={handleChange}
                        value={currentPost.tag}
                      />
                      <Select
                        options={allUsers}
                        onChange={handleMentions}
                        isMulti
                        value={currentPost.mentions.map((option) => {
                          return { value: option, label: option };
                        })}
                        placeholder="@ mention"
                        ref={selectRef}
                      />

                      {showLink && (
                        <MDBInput
                          size="md"
                          className=""
                          type="text"
                          id="form1Example2"
                          label="Add link"
                          name="link"
                          value={currentPost.link}
                          onChange={handleChange}
                        />
                      )}
                      <div className="d-flex flex-wrap align-items-center">
                        <MDBTooltip tag="a" title="Add link">
                          <MDBIcon
                            fas
                            icon="link"
                            size="md"
                            className="mx-2"
                            onClick={() => setShowLink(!showLink)}
                          ></MDBIcon>
                        </MDBTooltip>
                        <MDBTooltip tag="a" title="Add emoji">
                          <div className="emoji-container">
                            <MDBIcon
                              far
                              icon="grin"
                              className="emoji mx-2"
                              size="md"
                              onClick={() =>
                                setShowEmojiPicker(!showEmojiPicker)
                              }
                            ></MDBIcon>

                            {showEmojiPicker && (
                              <Picker
                                onEmojiClick={handleEmojiClick}
                                height="325px"
                                width="280px"
                              />
                            )}
                          </div>
                        </MDBTooltip>
                        <MDBTooltip tag="a" title="Add images">
                          <input
                            type="file"
                            label=""
                            id="updateImage"
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={(e) => updateImageForPost(e)}
                          />
                          <label htmlFor="updateImage">
                            <MDBIcon
                              fas
                              icon="image"
                              className="mx-2"
                              size="md"
                            />
                          </label>
                        </MDBTooltip>

                        {currentPost.images && (
                          <MDBContainer className="m-1">
                            <MDBRow className="g-1">
                              {currentPost.images.map((image, index) => (
                                <MDBCol md="6" key={index}>
                                  <div className="image-container">
                                    <img
                                      src={image}
                                      alt={"image"}
                                      className="img-fluid"
                                    />
                                    <MDBBtn
                                      color="none"
                                      aria-label="Close"
                                      className="btn-close"
                                      onClick={(e) => removeImage(e, index)}
                                    />
                                  </div>
                                </MDBCol>
                              ))}
                            </MDBRow>
                          </MDBContainer>
                        )}
                        <div className="d-flex  gap-1 justify-content-between  w-100">
                          <MDBBtn color="danger" onClick={deletePoster}>
                            Delete
                          </MDBBtn>
                          <MDBBtn color="primary" onClick={updatePoster}>
                            Update
                          </MDBBtn>
                        </div>
                      </div>
                    </form>
                  </div>
                  <ToastContainer />
                </MDBContainer>
              )}
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </Container>
  );
}
const Container = styled.div`
  .modal-body {
    max-height: 35rem !important;
    overflow-y: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 5px;
      border-radius: 0.5rem;
      scroll-behavior: smooth;
      &-thumb {
        background-color: #656464;
      }
    }
  }

  margin: 1rem 0;
  i {
    cursor: pointer;
  }
  .post-container {
    max-width: 40rem;
    min-width: 15rem;
  }
  .image-container {
    position: relative;
    img {
      width: 100%;
      height: 10rem;
      border-radius: 0.25rem;
      object-fit: cover;
    }
    .btn-close {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background-color: white !important;
    }
  }
  .emoji-container {
    position: relative;
    .EmojiPickerReact {
      position: absolute;
      bottom: 1.5rem;
      .epr-body::-webkit-scrollbar {
        width: 5px;
        scroll-behavior: smooth;
        &-thumb {
          background-color: gray;
        }
      }
      .epr-search-container {
        input {
          background-color: transparent;
        }
      }
    }
  }
`;
