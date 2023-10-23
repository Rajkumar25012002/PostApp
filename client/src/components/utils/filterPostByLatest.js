export default function filterPostByLatest(allPosts, timePeriod) {
  const now = new Date();
  let filterDate = new Date();
  if (!timePeriod) {
    return allPosts
      .slice()
      .sort((a, b) => b.datePosted.localeCompare(a.datePosted));
  }
  if (timePeriod === "day") {
    filterDate.setDate(now.getDate() - 1);
  } else if (timePeriod === "week") {
    filterDate.setDate(now.getDate() - 7);
  }
  const filterePosts = allPosts
    .slice()
    .sort((a, b) => b.datePosted.localeCompare(a.datePosted))
    .filter((post) => new Date(post.lastUpdated) >= filterDate);
  return filterePosts;
}
