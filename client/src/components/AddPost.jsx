import styled from "styled-components";
import { useState, useRef } from "react";
import Picker from "emoji-picker-react";
import { useDispatch } from "react-redux";
import { addPost } from "../features/postSlice";
import { useContext } from "react";
import { UserContext } from "../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptionError, toastOptionSuccess } from "./utils/toastOptions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import Select from "react-select";
import { getStateErr, getStateStatus } from "../features/postSlice";
import { selectAllUsers } from "../features/userSlice";
import {
  MDBContainer,
  MDBInput,
  MDBTextArea,
  MDBTypography,
  MDBIcon,
  MDBBtn,
  MDBTooltip,
  MDBRow,
  MDBCol,
  MDBCard,
} from "mdb-react-ui-kit";
import SelectVisibility from "../InputElements/SelectVisibility";
const AddPost = () => {
  const selectRef = useRef();
  const allUsers = useSelector(selectAllUsers).map((user) => {
    return { value: user.user_name, label: user.user_name };
  });
  const { user, userIdFromToken, userInfo } = useContext(UserContext);
  const [post, setPost] = useState({
    tag: "",
    content: "",
    link: "",
    mentions: [],
    images: [],
    visibility: "Public",
  });
  const [addPostRequest, setAddPostRequest] = useState("idle");
  const [showLink, setShowLink] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const postStatus = useSelector(getStateStatus);
  const postErr = useSelector(getStateErr);
  const dispatch = useDispatch();
  const visibilityOptions = [
    { value: "Public", label: "Public", icon: "globe" },
    { value: "Private", label: "Private", icon: "lock" },
    { value: "Circle", label: "Circle", icon: "user-friends" },
  ];
  const addPoster = (e) => {
    e.preventDefault();
    if (post.tag && post.content && addPostRequest === "idle") {
      try {
        setAddPostRequest("pending");
        dispatch(
          addPost({
            details: {
              title: post.tag,
              userName: userInfo.user_name,
              userid: userIdFromToken,
              datePosted: new Date().toISOString(),
              content: post.content,
              link: post.link,
              images: post.images,
              mentions: post.mentions,
              visibility: post.visibility,
            },
            token: user.accessToken,
          })
        );
        selectRef.current.clearValue();
        setPost({
          tag: "",
          content: "",
          link: "",
          images: [],
          mentions: [],
          visibility: "PUBLIC",
        });

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
  const handleChange = (e) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value,
    });
  };
  const handleEmojiClick = (emoji) => {
    let msg = post.content;
    msg += emoji.emoji;
    setPost({
      ...post,
      content: msg,
    });
  };
  const handleMentions = (e) => {
    setPost({
      ...post,
      mentions: e.map((option) => option.value),
    });
  };
  const addImageForPost = (e) => {
    const file = e.target.files;
    for (let i = 0; i < file.length; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(file[i]);
      reader.onload = () => {
        setPost({
          ...post,
          images: [...post.images, reader.result],
        });
      };
    }
  };

  const removeImage = (e, index) => {
    e.preventDefault();
    setPost({
      ...post,
      images: post.images.filter((_, i) => i !== index),
    });
  };

  return (
    <Container>
      <MDBCard className=" p-3 border post-container">
        <div className="d-flex flex-column gap-2">
          <MDBTypography variant="h5">Post Something</MDBTypography>
          <hr />
          <form className="d-flex flex-column gap-2">
            <MDBTextArea
              label="Content"
              id="textAreaExample"
              rows={4}
              name="content"
              onClick={() => setShowEmojiPicker(false)}
              onChange={handleChange}
              value={post.content}
            />
            <MDBInput
              size="md"
              className=""
              type="text"
              id="form1Example2"
              label="Add tag"
              name="tag"
              onChange={handleChange}
              value={post.tag}
            />
            <Select
              options={allUsers}
              onChange={handleMentions}
              isMulti
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
                value={post.link}
                onChange={handleChange}
              />
            )}
            <div className="d-flex my-0 flex-wrap align-items-center">
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
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
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
                  id="imageForPost"
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={addImageForPost}
                />
                <label htmlFor="imageForPost">
                  <MDBIcon fas icon="image" className="mx-2" size="md" />
                </label>
              </MDBTooltip>
              {post.images && (
                <MDBContainer className="my-1">
                  <MDBRow className="g-1">
                    {post.images.map((image, index) => (
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
              <div className="d-flex justify-content-between w-100">
                <div
                  className="visibility-container d-flex align-items-center border"
                  style={{ borderRadius: "1.5rem" }}
                >
                  <MDBIcon
                    style={{ paddingLeft: "1rem", width: "2.15rem" }}
                    fas
                    icon={
                      visibilityOptions.filter(
                        (option) => option.value === post.visibility
                      )[0]?.icon
                    }
                  />
                  <SelectVisibility
                    options={visibilityOptions}
                    post={post}
                    setPost={setPost}
                  />
                </div>
                <MDBBtn color="primary" onClick={addPoster}>
                  Post
                </MDBBtn>
              </div>
            </div>
          </form>
        </div>
      </MDBCard>
      <ToastContainer />
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
  i {
    cursor: pointer;
  }
  .post-container {
    width: 40rem;
    margin: auto;
    @media screen and (max-width: 675px) {
      width: 100%;
    }
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
export default AddPost;
