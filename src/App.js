import './App.css';
import React, { Component } from "react";
import { BrowserRouter as Router } from 'react-router-dom';

import { Container, Row, Col } from 'react-bootstrap';
import { HeaderNavRow } from './BootstrapElement.styled';

import PageBody from './Page/PageBody';
import { Link } from 'react-router-dom';

import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './global.styled';
import { theme } from './theme';
//import { StyledLogo } from './Logo.styled';

//import { Burger, Menu } from './Components';

//import logo from './assets/images/logo.svg';
//import ResumeCircleElement from './Components/Svg/ResumeCircleElement';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            open: false,
            setOpen: this.openMenuHandler,
        }
       // this.openMenu = this.openMenu.bind(this);
    }
    openMenuHandler = () => {
        this.setState(prevState => ({
            open: !prevState.open
        }));
  }
  render() {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        { /*<ResumeCircleElement />*/}
        <Router>
          <Container fluid>
            <HeaderNavRow className="g-0">
              <Col>
                <nav className="Navigation">
                  <Link to="/">Home</Link>
                  <Link to="/about">About</Link>
                  <Link to="/work">Work</Link>
                </nav>
              </Col>
              {/*
              <Col>
                <Burger open={this.state.open} setOpen={this.state.setOpen} />
                <Menu open={this.state.open} setOpen={this.state.setOpen} />
              </Col>
*/}
              {/*
              <Col>
                <ResumeCircleElement />
              </Col>
*/}
            </HeaderNavRow>
            <Row>
              <Col>
                <PageBody />
              </Col>
            </Row>
          </Container>
        </Router>
      </ThemeProvider>
    )
  }
}
//const rootElement = document.getElementById("root");
//ReactDOM.render(<App />, rootElement);
export default App
