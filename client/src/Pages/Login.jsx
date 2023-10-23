import { useEffect } from "react";
import styled from "styled-components";
import { useState, useContext } from "react";
import { useNavigate ,Link} from "react-router-dom";
import { UserContext } from "../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  toastOptionError,
  toastOptionSuccess,
} from "../components/utils/toastOptions";
import { URL } from "../components/utils/API";
import {
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";
import logo from "../assets/logo.png";
const Login = () => {
  const { user, setUser } = useContext(UserContext);
  const [user_name, setUser_name] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const canSave = password && user_name;
  useEffect(() => {
    if (user?.accessToken) {
      navigate("/");
    }
  }, [user, navigate]);
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${URL}/user/login`, {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_name,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.accessToken) {
          setUser({
            accessToken: data.accessToken,
          });
          toast.success(data.message, toastOptionSuccess);
          navigate("/");
        } else if (data.status === false) {
          toast.error(data.message, toastOptionError);
        }
      });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "user_name") {
      setUser_name(value);
    }
    if (name === "password") {
      setPassword(value);
    }
  };
  return (
    <Container>
      <section className="background-radial-gradient overflow-hidden">
        <div className="container  text-center text-lg-start my-5">
          <div className="d-flex align-items-center">
            <img
              src={logo}
              height="50"
              alt="Social Network Logo"
              loading="lazy"
            />
            <h3 className="name display-7 fw-bold" style={{ color: "#9654bd" }}>
              MINDWAVE
            </h3>
          </div>
          <MDBRow className="gx-lg-5 align-items-center justify-content-center">
            <MDBCol lg="6" className="mb-5 mb-lg-0" style={{ zIndex: 10 }}>
              <h1
                className="my-5 display-5 fw-bold ls-tight"
                style={{ color: "hsl(218, 81%, 95%)" }}
              >
                Unlock a World of Creativity <br />
                <span style={{ color: "hsl(218, 81%, 75%)" }}>
                  Share Your Posts, Inspire the World!
                </span>
              </h1>
              <p
                className="mb-4 opacity-70"
                style={{ color: "hsl(218, 81%, 85%)" }}
              >
                Welcome to our vibrant post-sharing community, where creativity
                knows no bounds. Join a diverse network of individuals, each
                with their unique stories to tell. Discover, connect, and share
                your thoughts, experiences, and ideas. Whether you are an avid
                storyteller, an insightful thinker, or just looking to engage
                with like-minded souls, our platform is your canvas. Dive into
                the world of post sharing and express yourself in your own
                unique way. Start your journey now and be a part of our thriving
                community!
              </p>
            </MDBCol>

            <MDBCol lg="6" className="mb-lg-0 position-relative login">
              <div
                id="radius-shape-1"
                className="position-absolute rounded-circle shadow-5-strong"
              ></div>
              <div
                id="radius-shape-2"
                className="position-absolute shadow-5-strong"
              ></div>

              <MDBCard className="bg-glass align-self-center">
                <MDBCardBody>
                  <div className=" d-flex justify-content-center pb-3">
                    <h2>LOGIN</h2>
                  </div>
                  <form>
                    <MDBInput
                      className="mb-2"
                      label="Username"
                      icon="user"
                      type="text"
                      value={user_name}
                      onChange={handleChange}
                      name="user_name"
                      required
                    />
                    <MDBInput
                      className="mb-2"
                      label="Password"
                      icon="lock"
                      type="password"
                      value={password}
                      onChange={handleChange}
                      name="password"
                      required
                    />
                    <MDBBtn
                      color="primary"
                      className="btn-block mb-4"
                      type="submit"
                      onClick={handleSubmit}
                      disabled={!canSave}
                    >
                      Sign in
                    </MDBBtn>
                    <MDBRow className="mb-2">
                      <MDBCol className="d-flex justify-content-center">
                        <a href="#!">Forgot password?</a>
                      </MDBCol>
                    </MDBRow>
                    <div className="text-center">
                      <p>
                        Not a member? <Link to="/register">Sign up</Link>
                      </p>
                    </div>
                  </form>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </div>
      </section>
      <ToastContainer />
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;

  .login{
    max-width: 30rem;
    margin: auto;
  }
  .name {
    margin: 0 !important;
  }
  .background-radial-gradient {
    height: 100vh;
    width: 100vw;
    @media screen and (max-width: 992px) {
      overflow-y: auto !important;
    }
    background-color: hsl(218, 41%, 15%);
    background-image: radial-gradient(
        650px circle at 0% 0%,
        hsl(218, 41%, 35%) 15%,
        hsl(218, 41%, 30%) 35%,
        hsl(218, 41%, 20%) 75%,
        hsl(218, 41%, 19%) 80%,
        transparent 100%
      ),
      radial-gradient(
        1250px circle at 100% 100%,
        hsl(218, 41%, 45%) 15%,
        hsl(218, 41%, 30%) 35%,
        hsl(218, 41%, 20%) 75%,
        hsl(218, 41%, 19%) 80%,
        transparent 100%
      );
  }

  #radius-shape-1 {
    height: 220px;
    width: 220px;
    top: -60px;
    left: -130px;
    background: radial-gradient(#44006b, #ad1fff);
    overflow: hidden;
  }

  #radius-shape-2 {
    border-radius: 38% 62% 63% 37% / 70% 33% 67% 30%;
    bottom: -60px;
    right: -110px;
    width: 300px;
    height: 300px;
    background: radial-gradient(#44006b, #ad1fff);
    overflow: hidden;
  }

  .bg-glass {
    background-color: hsla(0, 0%, 100%, 0.9) !important;
    backdrop-filter: saturate(200%) blur(25px);
  }
`;
export default Login;
