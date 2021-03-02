import './App.css';
import React, { Component } from "react";
import { BrowserRouter as Router } from 'react-router-dom';

import { Container, Row, Col } from 'react-bootstrap';

import Nav from './Navigation/Navigation';

const Routes = () => {
    return (
        <Nav />
    )
}
class App extends Component {
    render() {
        return (
            <Container>
            <Row>
              <Col md={4}>LOGO</Col>
              <Col md={{ span: 4, offset: 4 }}>
            <Router>
              <Routes />
            </Router>
              </Col>
            </Row>
          </Container>
        )
    }
}
//const rootElement = document.getElementById("root");
//ReactDOM.render(<App />, rootElement);
export default App
