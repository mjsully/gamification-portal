"use client";

import LevelCalculator from '../levelCalculator'
import MyNavBar from '../myNavBar'

import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from "react-bootstrap/Container";
import ProgressBar from 'react-bootstrap/ProgressBar';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {

  const [data, setData] = useState(null);

  function GetData() {

    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setData(data);
      })
      .catch((err) => {
        console.log(err)
      })

  }

  function ListData() {

    if (data.length > 0) {
      return (
        <>
          <div>
            <Row>
              {data.map((user) => (
                <Container className="mt-2 mb-2 w-100" key={user.id}>
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        <a href={`/user/${user.id}`} className="card-title stretched-link">{user.name} {user.admin ? "(Admin)" : ""}</a>
                      </Card.Title>
                      <Card.Subtitle>
                        Level {LevelCalculator(user).currentLevel}
                      </Card.Subtitle>
                      <Card.Text>
                        Has earned X badges.
                      </Card.Text>
                      <ProgressBar now={LevelCalculator(user).currentLevelPercentage} variant="success" label={LevelCalculator(user).progressBarData} className="progress-bar-striped progress-bar-animated">
                      </ProgressBar>
                      {window.location.pathname == "/admin" &&
                        <Container fluid className="mt-2 mb-2">
                          <Button variant="primary" onClick={(e) => changeShowModal(e, user)}>
                            Details
                          </Button>
                        </Container>
                      }
                    </Card.Body>
                  </Card>
                </Container>
              ))}
            </Row>
          </div>
        </>

      );
    }

  return (
    <p> No user data available </p>
  )
      
  }

  function ShowAlert() {
    return (
      <Alert variant="warning">
        This is an early version, with several known missing features:
          <p> - The creation and awarding of badges/awards is implemented in the backend but not the frontend. </p>
          <p> - The badge count is currently a placeholder value, "X" </p>
          <p> - User roles are not yet implemented </p>
      </Alert>
    )
  }

  useEffect(() => {
    GetData();
  }, []);

  return (
    <Container>

      {<MyNavBar location="home" />}
      {<ShowAlert/>}
      <h1 className="mt-2 mb-2"> Leaderboard </h1>
      <Col>

        {data && <ListData />}
      </Col>

    </Container>
  );
}
