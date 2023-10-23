import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate} from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectAllPosts } from "../features/postSlice";
import styled from "styled-components";
import Post from "../components/Post";
import { addComment } from "../features/postSlice";
import { useDispatch } from "react-redux";
import { useContext } from "react";
import { UserContext } from "../App";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBTextArea
} from "mdb-react-ui-kit";
import Comment from "../components/Comment";
const SinglePost = () => {
  const { user, userIdFromToken, userInfo } = useContext(UserContext);
  const [comment, setComment] = useState("");
  const textareaRef = useRef();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allPosts = useSelector(selectAllPosts);
  const currentPost = allPosts.find((post) => post.postId === id);
  const handleAddComment = (e) => {
    e.preventDefault();
    if (comment === "") return;
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
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "40px";
    const { scrollHeight } = textareaRef.current;
    textareaRef.current.style.height = `${scrollHeight}px`;
  }, [comment]);
  return (
    <Container>
      <MDBModal show={true} tabIndex="-1" onHide={() => navigate(-1)}>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Post</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => navigate(-1)}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              {currentPost && <Post post={currentPost} />}
              <div className="mt-2">
                <span className="d-flex  align-items-center gap-1 position-relative">
                  <MDBBtn
                    onClick={handleAddComment}
                    className="send-btn"
                    color="secondary"
                  >
                    Send
                  </MDBBtn>
                  <MDBTextArea
                    label="Add your comment"
                    className="max-height-10rem"
                    id="textAreaExample"
                    style={{ resize: "none" }}
                    inputRef={textareaRef}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment(e)}
                  />
                </span>

                <div className="comment-container mt-3 d-flex flex-column gap-2">
                  {currentPost?.comments.map((comment) => {
                    return (
                      <Comment
                        key={comment.createdAt}
                        currentPost={currentPost}
                        comment={comment}
                      />
                    );
                  })}
                </div>
              </div>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </Container>
  );
};
const Container = styled.div`
  i {
    cursor: pointer;
  }
  .modal-dialog {
    max-width: max-content !important;
  }
  .modal-content {
    max-width: max-content !important;
  }
  @media screen and (max-width: 576px) {
    .modal-dialog,
    .modal-content {
      max-width: auto;
      width: auto;
    }
  }
  .modal-body {
    max-height: 35rem;
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
    textarea {
      &::-webkit-scrollbar {
        width: 0px;
        scroll-behavior: smooth;
        &-thumb {
          background-color: #ffffff;
        }
      }
    }
    .send-btn {
      position: absolute !important;
      align-self: center;
      right: 2px !important;
      bottom: 2px !important;
      z-index: 5;
    }
  }
`;
export default SinglePost;
