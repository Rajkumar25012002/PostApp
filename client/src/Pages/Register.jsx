import React from "react";
import styled from "styled-components";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  toastOptionError,
  toastOptionSuccess,
} from "../components/utils/toastOptions";
const Register = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [user_name, setUser_name] = useState();
  const navigate = useNavigate();
  const canSave = email && password && user_name;
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://blog-post-backend-k70d.onrender.com/user/register", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        user_name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === true) {
          toast.success(data.message, toastOptionSuccess);
          navigate("/login");
        } else {
          toast.error(data.message, toastOptionError);
        }
      });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    }
    if (name === "password") {
      setPassword(value);
    }
    if (name === "user_name") {
      setUser_name(value);
    }
  };
  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <div>Register</div>
        <label>Username</label>
        <input
          type="text"
          autoComplete=""
          placeholder="user01"
          value={user_name}
          onChange={handleChange}
          name="user_name"
        ></input>
        <label>Email</label>
        <input
          type="email"
          autoComplete="email"
          placeholder="example@gmail.com"
          value={email}
          onChange={handleChange}
          name="email"
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
        <button type="submit" disabled={!canSave}>
          Register
        </button>
        <Link to="/login" className="link">
          Already have an account?
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
      color: var(--text-normal);
      width: 75%;
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
export default Register;
