import "./App.css";
import { Route, Routes } from "react-router-dom";
import Navigation from "./Pages/Navigation";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import HomePage from "./Pages/HomePage";
import styled from "styled-components";
import SinglePost from "./Pages/SinglePost";
import EditPost from "./Pages/EditPost";
import EditUser from "./Pages/EditUser";
import { createContext, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminPage from "./Pages/AdminPage";
import jwtDecode from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SingleUser from "./Pages/SingleUser";
import { useSelector } from "react-redux";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { getUserDetailsById } from "./features/userSlice";
import { toastOptionSuccess } from "./components/utils/toastOptions";
import loadingImg from "./assets/loadingImg.gif";
import { URL } from "./components/utils/API";
import Connections from "./components/Connections";
import { useDispatch } from "react-redux";
import {
  getLimitedPost,
  getPostPerPage,
  getTotalPosts,
  getPostsFetched,
  getPostLoading,
} from "./features/postSlice";
export const UserContext = createContext([]);

function App() {
  const [user, setUser] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const containerRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const totalPosts = useSelector(getTotalPosts);
  const postsFetched = useSelector(getPostsFetched);
  const isPostFetching = useSelector(getPostLoading);
  const postPerPage = useSelector(getPostPerPage);
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
      .then(() => setUser(null));

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
          setLoading(false);
        });
    }
    checkRereshToken();
  }, []);
  const location = useLocation();
  const handleScroll = async () => {
    if (!containerRef.current) return;

    const { scrollHeight, scrollTop, clientHeight } = containerRef.current;
    const scrollPosition = scrollTop + clientHeight;
    const scrollTrigger = scrollHeight - 5;

    if (scrollPosition >= scrollTrigger) {
      if (
        postsFetched >= 3 &&
        postsFetched < totalPosts &&
        !isPostFetching &&
        location.pathname === "/"
      ) {
        dispatch(
          getLimitedPost({
            postsFetched: postsFetched,
            postsPerPage: postPerPage,
          })
        );
      }
    }
  };
  useEffect(() => {
    const container = containerRef.current;
    if (postPerPage >= 0 && postsFetched >= 0) {
      if (container) {
        container.addEventListener("scroll", handleScroll);

        return () => {
          container.removeEventListener("scroll", handleScroll);
        };
      }
    }
  });
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
    <Container ref={containerRef}>
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
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            >
              <Route
                path="edit/post/:id"
                element={
                  <ProtectedRoute>
                    <EditPost />
                  </ProtectedRoute>
                }
              />
              <Route
                path="post/:id"
                element={
                  <ProtectedRoute>
                    <SinglePost />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="admin" element={<AdminPage />} />
            <Route
              path="user/:userid"
              element={
                <ProtectedRoute>
                  <SingleUser />
                </ProtectedRoute>
              }
            >
              <Route
                path="edit"
                element={
                  <ProtectedRoute>
                    <EditUser />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":connections"
                element={
                  <ProtectedRoute>
                    <Connections />
                  </ProtectedRoute>
                }
              />
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
  overflow-x: hidden;
  background-color: #f5f5f5;
`;
export default App;
