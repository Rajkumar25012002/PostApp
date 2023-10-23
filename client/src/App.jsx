import "./App.css";
import { Route, Routes } from "react-router-dom";
import Navigation from "./Pages/Navigation";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import HomePage from "./Pages/HomePage";
import styled from "styled-components";
import SinglePost from "./Pages/SinglePost";
import EditPost from "./Pages/EditPost";
import EditUser from "./components/EditUser";
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminPage from "./Pages/AdminPage";
import jwtDecode from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SingleUser from "./Pages/SingleUser";
import { useSelector } from "react-redux";
import { getUserDetailsById } from "./features/userSlice";
import { toastOptionSuccess } from "./components/utils/toastOptions";
import loadingImg from "./assets/loadingImg.gif";
import { URL } from "./components/utils/API";
import Connections from "./components/Connections";
export const UserContext = createContext([]);

function App() {
  const [user, setUser] = useState({});
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userIdFromToken =
    user?.accessToken && jwtDecode(user.accessToken).userid;
  const currentUserDetails = useSelector((state) =>
    getUserDetailsById(state, userIdFromToken)
  );
  const userRoleFromToken =
    user?.accessToken && jwtDecode(user.accessToken).userRole;

  const handleLogOut = async (e) => {
    e.preventDefault();
    await fetch(`${URL}/user/logout`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => toast.success(data.message, toastOptionSuccess))
      .then(() => setUser({}));
    navigate("/login");
  };
  useEffect(() => {
    async function checkRereshToken() {
      fetch(`${URL}/user/refresh_token`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.accessToken) {
            setUser({
              accessToken: data.accessToken,
            });
          }
        });
      setLoading(false);
    }
    checkRereshToken();
  }, []);
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navigation logout={handleLogOut} />
        <img
          style={{ alignSelf: "center", margin: "5rem" }}
          src={loadingImg}
          alt="Loading........"
        ></img>
      </div>
    );
  }
  return (
    <Container>
      <ToastContainer />
      <UserContext.Provider
        value={{
          user,
          setUser,
          searchText,
          setSearchText,
          userIdFromToken,
          userInfo: currentUserDetails,
          userRoleFromToken,
        }}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigation logout={handleLogOut} />}>
            <Route path="/" element={<HomePage />}>
              <Route path="edit/post/:id" element={<EditPost />} />
              <Route path="post/:id" element={<SinglePost />} />
            </Route>
            <Route path="admin" element={<AdminPage />} />
            <Route path="user/:userid" element={<SingleUser />}>
              <Route path="edit" element={<EditUser />} />
              <Route path=":connections" element={<Connections />} />
            </Route>
          </Route>
        </Routes>
      </UserContext.Provider>
    </Container>
  );
}
const Container = styled.div`
display: flex;
flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow-y: auto;
  overflow-x:hidden ;
`;
export default App;
