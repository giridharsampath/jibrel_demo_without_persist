import React from "react";
import { Navbar } from "react-bootstrap";
import styled from "styled-components";

const Styles = styled.div`
  .navbar {
    background: #222;
  }
  .navbar-brand,
  .navbar-nav a {
    padding-left: 10px;
    color: #bbb;
    text-decoration: none;
    &:hover {
      color: #fff;
      text-decoration: none;
    }
  }
`;

export const NavigationBar = () => (
  <Styles>
    <Navbar expand="sm" bg="dark">
      <Navbar.Brand href="/">Jibrel Demo</Navbar.Brand>
    </Navbar>
  </Styles>
);
