import { useSelector } from "react-redux";
import {
  getAllUserCommentedPosts,
  getPostLoading,
  getStateStatus,
  getUserCommentedPosts,
} from "../features/postSlice";
import Post from "./Post";
import PostSkeleton from "./Placeholders/PostSkeleton";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Comment from "./Comment";
import { FcDownRight } from "react-icons/fc";
const UserCommentedPost = ({ userid, userinfo }) => {
  const dispatch = useDispatch();
  const selectCommentedPosts = useSelector(getAllUserCommentedPosts);
  const isPostsFetching = useSelector(getPostLoading);
  const postStatus = useSelector(getStateStatus);
  useEffect(() => {
    if (userid && !isPostsFetching) {
      dispatch(getUserCommentedPosts(userid));
    }
  }, [userinfo?.isDeactivated]);
  if (isPostsFetching || postStatus === "loading") {
    return <PostSkeleton />;
  }

  return (
    <>
      {selectCommentedPosts.length > 0 ? (
        selectCommentedPosts
          .slice()
          .sort((a, b) => b.datePosted.localeCompare(a.datePosted))
          .map((post, index) => {
            return (
              <>
                <Post post={post} key={index} />
                {post.comments.map((comment, index) => {
                  return (
                    <div
                      key={index}
                      className="d-flex gap-1 my-2 align-items-center"
                    >
                      {comment.authorId === userinfo.userid && (
                        <>
                          <FcDownRight size={"3rem"} />
                          <Comment comment={comment} currentPost={post} />
                        </>
                      )}
                    </div>
                  );
                })}
              </>
            );
          })
      ) : (
        <div style={{ textAlign: "center", maxWidth: "40rem" }}>
          You have not commented on any post yet
        </div>
      )}
    </>
  );
};

export default UserCommentedPost;
