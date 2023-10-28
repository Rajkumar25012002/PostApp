export default function filterPostByVisibility(postList, userInfo) {
  if (!postList) return [];
  const filteredPosts = postList.filter((post) => {
    if (post.visibility === "Public") {
      return true;
    } else if (post.visibility === "Private") {
      return post.userid === userInfo.userid;
    } else if (post.visibility === "Circle") {
      return (
        post.userid === userInfo.userid ||
        userInfo.userHistory.followings.includes(post.userid) ||
        userInfo.userHistory.followers.includes(post.userid)
      );
    }
  });
  return filteredPosts;
}
