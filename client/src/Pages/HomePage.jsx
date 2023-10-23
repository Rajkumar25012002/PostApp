import { useContext, useEffect } from "react";
import { UserContext } from "../App";
import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import AddPost from "../components/AddPost";
import MainPage from "../components/MainPage";
const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  useEffect(() => {
    if (user.accessToken === undefined) {
      navigate("/login");
    }
  }, [user, navigate]);
  return (
    <>
      {user.accessToken && (
        <Container>
          <AddPost />
          <MainPage />
          <Outlet/>
        </Container>
      )}
    </>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export default HomePage;
