import React, { useEffect } from "react";
import styled from "styled-components";
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  toastOptionError,
  toastOptionSuccess,
} from "../components/utils/toastOptions";
const Login = () => {
  const { user, setUser } = useContext(UserContext);
  const [user_name, setUser_name] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.accessToken) {
      navigate("/");
    }
  }, [user]);
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://blog-post-backend-k70d.onrender.com/user/login", {
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
      <form onSubmit={handleSubmit}>
        <div>Login</div>
        <label>Username</label>
        <input
          type="text"
          autoComplete=""
          placeholder="user01"
          value={user_name}
          onChange={handleChange}
          name="user_name"
        ></input>
        <label>Password</label>
        <input
          type="password"
          autoComplete="Password"
          value={password}
          onChange={handleChange}
          placeholder=""
          name="password"
        ></input>
        <button type="submit">Login</button>
        <Link to="/register" className="link">
          Don't have an account?
        </Link>
      </form>
      <ToastContainer />
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh;
  form {
    display: flex;
    flex-direction: column;
    min-width: 20rem;
    border: 1px solid rgb(219, 219, 219);
    height: 50%;
    gap: 0.25rem;
    border-radius: 0.5rem;
    align-items: center;
    justify-content: center;
    div {
      font-size: 1.5rem;
      font-weight: bold;
      color: rgba(38, 38, 38, 0.65);
      margin-bottom: 2.5rem;
      text-transform: uppercase;
    }
    label {
      color: var(--text-header);
      padding: 0.25rem;
      width: 75%;
    }
    input {
      font-size: 1rem;
      padding: 0.25rem;
      border-radius: 0.25rem;
      width: 75%;
      color: var(--text-normal);
      border: 2px solid rgb(219, 219, 219);
      outline: none;
    }
    button {
      font-size: 1rem;
      border-radius: 0.5rem;
      border: none;
      width: 75%;
      outline: none;
      margin: 0.75rem;
      padding: 0.5rem;
      color: var(--text-button);
      background-color: var(--button);
      transition: 0.3s ease-out;
      &:hover {
        background-color: var(--button-hover);
      }
    }
    .link {
      color: var(--button);
      &:hover {
        color: var(--button-hover);
      }
    }
  }
`;
export default Login;
