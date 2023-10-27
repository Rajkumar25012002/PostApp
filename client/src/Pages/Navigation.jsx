import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo.png";
import { useContext } from "react";
import { UserContext } from "../App";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBIcon,
  MDBNavbarToggler,
  MDBCollapse,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBDropdownItem,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdown,
  MDBTypography,
} from "mdb-react-ui-kit";
import SearchBox from "../InputElements/SearchBox";
const Navigation = ({ logout }) => {
  const [showNavNoToggler, setShowNavNoToggler] = useState(false);
  const { userInfo } = useContext(UserContext);
  const userId = userInfo?.userid;
  return (
    <>
      <Container>
        <MDBNavbar expand="lg" sticky light bgColor="light">
          <MDBContainer fluid>
            <MDBNavbarBrand>
              <Link to="/">
                <img
                  src={logo}
                  height="40"
                  alt="Social Network Logo"
                  loading="lazy"
                />
                MINDWAVE
              </Link>
            </MDBNavbarBrand>
            <SearchBox />
            <MDBNavbarToggler
              type="button"
              data-target="#navbarTogglerDemo01"
              aria-controls="navbarTogglerDemo01"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={() => setShowNavNoToggler(!showNavNoToggler)}
            >
              <MDBIcon icon="bars" fas />
            </MDBNavbarToggler>
            <MDBCollapse navbar show={showNavNoToggler}>
              <MDBNavbarNav
                className="mb-2 mb-lg-0 justify-content-end"
                right
                fullWidth={false}
              >
                <MDBNavbarItem>
                  <MDBDropdown>
                    <MDBDropdownToggle
                      tag="a"
                      className="nav-link d-flex align-items-center gap-1"
                      role="button"
                    >
                      <MDBIcon fas size="lg" icon="user-circle" />
                      <MDBTypography className="display-8 m-0">
                        {userInfo?.user_name}
                      </MDBTypography>
                    </MDBDropdownToggle>
                    <MDBDropdownMenu>
                      <MDBDropdownItem link>
                        <Link to={`/user/${userId}`}>
                          <MDBIcon fas icon="user" />
                          Profile
                        </Link>
                      </MDBDropdownItem>
                      <MDBDropdownItem link onClick={logout}>
                        <MDBIcon fas icon="sign-out-alt" />
                        Logout
                      </MDBDropdownItem>
                    </MDBDropdownMenu>
                  </MDBDropdown>
                </MDBNavbarItem>
              </MDBNavbarNav>
            </MDBCollapse>
          </MDBContainer>
        </MDBNavbar>
      </Container>
      <Outlet />
    </>
  );
};
const Container = styled.div`
  a {
    color: black !important;
  }
`;
export default Navigation;
