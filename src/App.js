import './App.css';
import React, { Component } from "react";
import { BrowserRouter as Router } from 'react-router-dom';

import { Container, Row, Col } from 'react-bootstrap';

//import Navigation from './Navigation/Navigation';
import PageBody from './Page/PageBody';

import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './global';
import { theme } from './theme';

import { Burger, Menu } from './Components';

//const Routes = () => {
//    return (
//        <Navigation />
//    )
//}

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
            <Router>
            <Burger open={this.state.open} setOpen={this.state.setOpen} />
            <Menu open={this.state.open} setOpen={this.state.setOpen} />
            <Container>
            <Row>
              <Col md={4}>LOGO</Col>
              <Col md={{ span: 4, offset: 4 }}>
            { /* <Routes /> */ }
              </Col>
            </Row>
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
