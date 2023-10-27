import { useSelector } from "react-redux";
import {
  getAllUserPosts,
  getPostLoading,
  getStateStatus,
  getUserPosts,
} from "../features/postSlice";
import Post from "./Post";
import PostSkeleton from "./Placeholders/PostSkeleton";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
const UserPost = ({ userid, userinfo }) => {
  const dispatch = useDispatch();
  const selectUserPost = useSelector(getAllUserPosts);
  const isPostsFetching = useSelector(getPostLoading);
  const postStatus = useSelector(getStateStatus);
  useEffect(() => {
    if (userid && !isPostsFetching) {
      dispatch(getUserPosts(userid));
    }
  }, [userinfo?.isDeactivated]);
  if (isPostsFetching || postStatus === "loading") {
    return <PostSkeleton />;
  }

  return (
    <>
      {selectUserPost.length > 0 ? (
        selectUserPost
          .slice()
          .sort((a, b) => b.datePosted.localeCompare(a.datePosted))
          .map((post, index) => {
            return <Post post={post} key={index} />;
          })
      ) : (
        <div style={{ textAlign: "center", maxWidth: "40rem" }}>
          You have not posted yet
        </div>
      )}
    </>
  );
};

export default UserPost;
