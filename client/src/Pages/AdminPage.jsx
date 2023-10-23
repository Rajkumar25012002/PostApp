import { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../App";
import styled from "styled-components";
import { URL } from "../components/utils/API";
const AdminPage = () => {
  const { user } = useContext(UserContext);
  const [content, setContent] = useState("You need to login....");
  useEffect(() => {
    fetch(`${URL}/user/isUserAuth`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setContent(data.data));
  }, [user]);
  return (
    <Container>
      <h2>Admin Page</h2>
      <div>{content}</div>
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h2 {
    color: var(--text-header);
  }
  div {
    color: var(--text-normal);
  }
`;
export default AdminPage;
