
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import AddPost from "../components/AddPost";
import MainPage from "../components/MainPage";
const HomePage = () => {
  return (
    <>
        <Container>
          <AddPost />
          <MainPage />
          <Outlet />
        </Container>
    </>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export default HomePage;
