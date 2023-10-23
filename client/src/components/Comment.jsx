import { Link } from "react-router-dom";
import { MDBCard, MDBCardFooter, MDBIcon } from "mdb-react-ui-kit";
import format from "date-fns/format";
import { useDispatch } from "react-redux";
import { updateComment } from "../features/postSlice";
import { useContext } from "react";
import { UserContext } from "../App";
const Comment = ({ comment, currentPost }) => {
  const dispatch = useDispatch();
  const { user, userIdFromToken } = useContext(UserContext);
  const handleLikeForComment = () => {
    dispatch(
      updateComment({
        details: {
          postId: currentPost.postId,
          commentId: comment._id,
          userId: userIdFromToken,
        },
        token: user.accessToken,
      })
    );
  };
  return (
    <MDBCard
      key={comment.createdAt}
      className="p-2"
      style={{ maxWidth: "40rem", width: "100%" }}
    >
      <div className="d-flex gap-1">
        <Link to={`/user/${comment.authorId}`} className="">
          <MDBIcon size="lg" fas icon="user-circle" />
        </Link>
        <div className="comment-detail">
          <p className="m-0 fw-bold">{comment.author}</p>
          <p
            className="m-0"
            style={{ fontSize: "12px", fontStyle: "italic" }}
          >{`Replying to @${currentPost.userName}`}</p>
          <p className="content m-0">{comment.content}</p>
          <p className="m-0" style={{ fontSize: "12px" }}>
            {format(new Date(comment.createdAt), "MMM d, yyy hh:mm a")}
          </p>
        </div>
      </div>
      <MDBCardFooter border="0" className="d-flex gap-5 p-0 mx-4">
        <span>
          <MDBIcon
            onClick={handleLikeForComment}
            fas
            icon="heart"
            style={{
              color: comment.likes.includes(userIdFromToken)
                ? "red"
                : "rgb(173, 173, 173)",
            }}
          />
          {comment?.likes ? comment.likes.length : 0}
        </span>
        <span>
          <MDBIcon fas icon="comment" />0
        </span>
      </MDBCardFooter>
    </MDBCard>
  );
};

export default Comment;
