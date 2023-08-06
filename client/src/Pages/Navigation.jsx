import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AiOutlineBars } from "react-icons/ai";
const Navigation = ({ logout, user }) => {
  const [toggle, setToggle] = useState(false);
  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth > 625) {
        setToggle(false);
      }
    });
  });
  return (
    <>
      <Container>
        <ul>
          {user?.accessToken && (
            <li>
              <Link className="linkname" to="/">
                Home
              </Link>
            </li>
          )}
          {user?.accessToken && (
            <li>
              <Link className="linkname" to="/user">
                User
              </Link>
            </li>
          )}
          <li>
            <Link className="linkname" to="/admin">
              Admin
            </Link>
          </li>
          {!user?.accessToken && (
            <li>
              <Link className="linkname" to="/login">
                Login
              </Link>
            </li>
          )}
          {!user?.accessToken && (
            <li>
              <Link className="linkname" to="/register">
                Register
              </Link>
            </li>
          )}
          {user?.accessToken && (
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          )}
          <li>
            <AiOutlineBars onClick={() => setToggle(!toggle)} display="none" />
          </li>
        </ul>
      </Container>
      {toggle && (
        <SubContainer>
          <ul onClick={() => setToggle(false)}>
            {user?.accessToken && (
              <li>
                <Link className="link" to="/">
                  Home
                </Link>
              </li>
            )}
            {user?.accessToken && (
              <li>
                <Link className="link" to="/user">
                  User
                </Link>
              </li>
            )}
            <li>
              <Link className="link" to="/admin">
                Admin
              </Link>
            </li>
            {!user?.accessToken && (
              <li>
                <Link className="link" to="/login">
                  Login
                </Link>
              </li>
            )}
            {!user?.accessToken && (
              <li>
                <Link className="link" to="/register">
                  Register
                </Link>
              </li>
            )}
            {user?.accessToken && (
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            )}
          </ul>
        </SubContainer>
      )}
    </>
  );
};
const Container = styled.div`
  width: 100%;
  background: linear-gradient(to right, rgb(76, 181, 249), rgb(105, 242, 158));
  height: 4rem;
  ul {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    list-style: none;
    @media screen and (max-width: 625px) {
      li {
        svg {
          display: block;
          font-size: larger;
          transition: 0.3s ease-out;
          &:hover {
            color: var(--text-button);
            transform: scale(1.1);
          }
        }
        .linkname {
          display: none;
        }
        button {
          display: none;
        }
      }
    }
    li {
      margin: auto 1.5rem;
      .linkname {
        color: #000000a6;
        font-weight: bold;
        text-transform: uppercase;
        text-decoration: none;
        transition: 0.3s ease-out;
        &:hover {
          color: var(--text-button);
        }
      }
      button {
        border: none;
        border-radius: 0.5rem;
        padding: 0.5rem;
        font-weight: bold;
        cursor: pointer;
        transition: 0.3s ease-out;
        &:hover {
          background-color: var(--button);
          color: var(--text-button);
          transform: scale(1.05);
        }
      }
    }
  }
`;
const SubContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  ul {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    margin: 0;
    gap: 1rem;
    position: absolute;
    border-radius: 0.5rem;
    width: 10rem;
    background: linear-gradient(
      to right,
      rgb(76, 181, 249),
      rgb(105, 242, 158)
    );
    border: 1px solid rgb(219, 219, 219);
    height: max-content;
    list-style: none;
    li {
      transition: 0.3sec ease-in-out;
      &:hover {
        transform: scale(1.05);
      }
      .link {
        color: #000000a6;
        font-weight: bold;
        text-transform: uppercase;
        text-decoration: none;
        transition: 0.3s ease-out;
        &:hover {
          color: var(--text-button);
        }
      }
      button {
        border: none;
        border-radius: 0.5rem;
        padding: 0.5rem;
        font-weight: bold;
        cursor: pointer;
        transition: 0.3s ease-out;
        &:hover {
          background-color: var(--button);
          color: var(--text-button);
          transform: scale(1.05);
        }
      }
    }
  }
`;
export default Navigation;
