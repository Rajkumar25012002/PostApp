import React, { useState } from "react";
import styled from "styled-components";
import Post from "./Post.jsx";
import { selectAllPosts, getStateStatus } from "../features/postSlice";
import { useSelector } from "react-redux";
const MainPage = () => {
  const allPosts = useSelector(selectAllPosts);
  const status = useSelector(getStateStatus);
  const [searchText, setSearchText] = useState("");
  let displaycontent;
  if (status === "loading") {
    displaycontent = <p>Loading...</p>;
  } else if (allPosts) {
    const orderedPosts = allPosts
      .slice()
      .sort((a, b) => b.datePosted.localeCompare(a.datePosted));
    displaycontent =
      searchText === null
        ? orderedPosts.map((post, index) => <Post key={index} post={post} />)
        : orderedPosts
            .filter(
              (post) =>
                post.title.toLowerCase().includes(searchText.toLowerCase()) ||
                post.content.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((post, index) => <Post key={index} post={post} />);
  }
  return (
    <Container>
      <div className="search-post">
        <input
          type="text"
          placeholder="Search for a post..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <div className="post-display">{displaycontent}</div>
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  overflow-y: auto;
  background-color: var(--page-background);
  border: 1px solid rgb(219, 219, 219);
  color: var(--text-normal);
  max-height: 85vh;
  .search-post {
    display: flex;
    padding: 0.5rem;
    justify-content: center;
    input {
      border-radius: 1rem;
      outline: none;
      width: 35rem;
      background-color: rgb(229, 238, 239);
      border: 1px solid rgb(182, 182, 182);
      padding: 0.5rem;
    }
  }
  .post-display {
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    gap: 0.5rem;
    overflow-y: auto;
    border-radius: 0.25rem;
    &::-webkit-scrollbar {
      width: 0.35rem;
      &-thumb {
        background-color: rgb(105, 242, 158);
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    border: 1px solid rgb(182, 182, 182);
    a {
      text-decoration: none;
    }
  }
`;
export default MainPage;
