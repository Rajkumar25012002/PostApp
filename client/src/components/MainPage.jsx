import styled from "styled-components";
import Post from "./Post.jsx";
import { selectAllPosts, getStateStatus } from "../features/postSlice";
import { useSelector } from "react-redux";
import { MDBBtnGroup, MDBContainer, MDBRadio } from "mdb-react-ui-kit";
import { useEffect, useState } from "react";
import filterPostByLatest from "./utils/filterPostByLatest.js";
import PostSkeleton from "./Placeholders/PostSkeleton.jsx";
import filterPostByVisibility from "./utils/filterPostByVisibility.js";
import { UserContext } from "../App.jsx";
import { useContext } from "react";
const MainPage = () => {
  const allPosts = useSelector(selectAllPosts);
  const status = useSelector(getStateStatus);
  const [type, setType] = useState("all");
  const [latestBy, setLatestBy] = useState("");
  const { userInfo } = useContext(UserContext);
  let displaycontent;
  if (status === "loading") {
    displaycontent = [1, 2].map((index) => <PostSkeleton key={index} />);
  } else if (allPosts) {
    const filterPostsByLatest = filterPostByLatest(allPosts, latestBy);
    const filterPostsByVisibility = filterPostByVisibility(
      filterPostsByLatest,
      userInfo
    );
    displaycontent =
      filterPostsByVisibility.length > 0 ? (
        filterPostsByVisibility.map((post, index) => (
          <Post key={index} post={post} />
        ))
      ) : (
        <p className="text-center m-0">No Post Available</p>
      );
  }
  useEffect(() => {}, [status]);
  return (
    <Container>
      <MDBContainer
        style={{ maxWidth: "40rem" }}
        className="my-3 d-flex flex-wrap gap-2 justify-content-between align-self-center"
      >
        <MDBBtnGroup>
          <MDBRadio
            btn
            btnColor="secondary"
            id="btn-radio2"
            name="options"
            defaultChecked={type === "all"}
            wrapperTag="span"
            label="All"
            onClick={() => {
              setType("All");
              setLatestBy("");
            }}
            value={"all"}
          />
          <MDBRadio
            btn
            btnColor="secondary"
            id="btn-radio3"
            name="options"
            defaultChecked={type === "latest"}
            wrapperTag="span"
            onClick={() => {
              setType("latest");
              setLatestBy("day");
            }}
            value={"latest"}
            label="Latest"
          />
        </MDBBtnGroup>
        {type === "latest" && (
          <MDBBtnGroup>
            <MDBRadio
              btn
              btnColor="secondary"
              id="btn-radio5"
              name="options"
              wrapperTag="span"
              defaultChecked={latestBy === "day"}
              onClick={() => setLatestBy("day")}
              value={"day"}
              label="Day"
            />
            <MDBRadio
              btn
              btnColor="secondary"
              id="btn-radio4"
              onClick={() => setLatestBy("week")}
              value={"week"}
              defaultChecked={latestBy === "week"}
              name="options"
              wrapperTag="span"
              label="Week"
            />
          </MDBBtnGroup>
        )}
      </MDBContainer>
      <div className="post-display d-flex flex-column gap-1">
        {displaycontent}
      </div>
    </Container>
  );
};
const Container = styled.div`
  .btn {
    border-radius: 0;
  }
`;
export default MainPage;
