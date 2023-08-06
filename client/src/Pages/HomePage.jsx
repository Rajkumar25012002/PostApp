import React, { useContext, useEffect } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import SideBar from "../components/SideBar";
import MainPage from "../components/MainPage";
const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  useEffect(() => {
    if (user.accessToken === undefined) {
      navigate("/login");
    }
  }, []);
  return (
    <>
      {user.accessToken && (
        <Container>
          <SideBar />
          <MainPage />
        </Container>
      )}
    </>
  );
};
const Container = styled.div`
  display: grid;
  grid-template-columns: 25% 70%;
  margin: 0.5rem;
  padding: 0.5rem;
  height: 88vh;
  color: var(--text-normal);
`;

export default HomePage;
