import styled from "styled-components";
import Post from "./Post.jsx";
import { selectAllPosts, getStateStatus } from "../features/postSlice";
import { useSelector } from "react-redux";
import { MDBBtnGroup, MDBContainer, MDBRadio } from "mdb-react-ui-kit";
import { useState } from "react";
import filterPostByLatest from "./utils/filterPostByLatest.js";
const MainPage = () => {
  const allPosts = useSelector(selectAllPosts);
  const status = useSelector(getStateStatus);
  const [type, setType] = useState("all");
  const [latestBy, setLatestBy] = useState("");
  let displaycontent;
  if (status === "loading") {
    displaycontent = <p>Loading...</p>;
  } else if (allPosts) {
    const filterePosts = filterPostByLatest(allPosts, latestBy);
    displaycontent =
      filterePosts.length > 0 ? (
        filterePosts.map((post, index) => <Post key={index} post={post} />)
      ) : (
        <p className="text-center m-0">No Post Available</p>
      );
  }
  return (
    <Container>
      <MDBContainer
        style={{ maxWidth: "40rem" }}
        className="my-3 d-flex align-items-center justify-content-between align-self-center"
      >
        <MDBBtnGroup>
          <MDBRadio
            btn
            btnColor="secondary"
            id="btn-radio2"
            name="options"
            checked={type === "all"}
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
            checked={type === "latest"}
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
              checked={latestBy === "day"}
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
              checked={latestBy === "week"}
              name="options"
              wrapperTag="span"
              label="Week"
            />
          </MDBBtnGroup>
        )}
      </MDBContainer>
      <div className="post-display d-flex flex-column gap-1 mx-1">
        {displaycontent}
      </div>
    </Container>
  );
};
const Container = styled.div`
  .btn {
    border-radius: 0;
  }
  .post-display {
    align-items: center;
    @media screen and (max-width: 510px) {
      align-items: normal;
    }
  }
`;
export default MainPage;
