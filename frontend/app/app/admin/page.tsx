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
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'


import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {

  const [data, setData] = useState(null);
  const [reload, setReload] = useState(null);

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

  function ChangeXp(user: object, xpIncrement: number) {

    fetch(`/api/user/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        admin: 0,
        xp: user.xp + xpIncrement,
        level: 0
      })
    })

    GetData();

  }

  function ListData() {

    return (
      <>
        <div>
          <Row>
            {data.map((user) => (
              <Container className="mt-2 mb-2 w-100" key={user.id}>
                <Card>
                  <Card.Body>
                    <Card.Title>
                      <a href={`/user/${user.id}`} className="card-title">{user.name} {user.admin ? "(Admin)" : ""}</a>
                    </Card.Title>
                    <Card.Subtitle>
                      Level {LevelCalculator(user).currentLevel}
                    </Card.Subtitle>
                    <Card.Text>
                      Has earned X badges.
                    </Card.Text>
                    <ProgressBar now={LevelCalculator(user).currentLevelPercentage} variant="success" label={LevelCalculator(user).progressBarData} className="progress-bar-striped progress-bar-animated">
                    </ProgressBar>
                    <Row className="mt-2 mb-2">
                      <Col>
                        <Button variant="primary" onClick={() => ChangeXp(user, 10)} className="w-100">
                          +10 XP
                        </Button>
                      </Col>
                      <Col>
                        <Button variant="warning" onClick={() => ChangeXp(user, -10)} className="w-100">
                          -10 XP
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Container>
            ))}
          </Row>
        </div>
      </>

    );

  }

  function handleUserCreation(e: object) {

    e.preventDefault();
    const name = e.target.name.value
    const xp = e.target.xp.value

    fetch("/api/users", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        admin: 0,
        xp: xp
      })
    })
    GetData();
    setReload(!reload);
  }

  function toggleAdminStatus(user: object) {

    console.log(user)
    console.log(typeof user)
    fetch(`/api/user/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        admin: user.admin ? 0 : 1,
        xp: user.xp,
        level: 0
      })
    })
    GetData();
    setReload(!reload);

  }

  function handleUserDeletion(user: object) {

    console.log(user)
    fetch(`/api/user/${user.id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    GetData();
    setReload(!reload);

  }

  function UserCreation() {

    return (

      <Form onSubmit={handleUserCreation}>
        <Form.Group className="mb-2 mt-2" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control placeholder="Enter username" />
        </Form.Group>

        <Form.Group className="mb-2 mt-2" controlId="xp">
          <Form.Label>Initial XP</Form.Label>
          <Form.Control placeholder="Enter initial XP" />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-2 mb-2">
          Submit
        </Button>
      </Form>

    )
  }

  function ListUsers() {

    return (

      <Table>
        <thead>
          <tr>
            <th>
              Name
            </th>
            <th>
              Experience
            </th>
            <th>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>

          {data.map((user) => (
            <tr key={user.id}>
              <td> {user.name} </td>
              <td> {user.xp} </td>
              <td>
                <Button variant="warning" className="mx-1" onClick={() => toggleAdminStatus(user)}>
                  Make {user.admin ? "user" : "admin"}
                </Button>
                <Button variant="danger" className="mx-1" onClick={() => handleUserDeletion(user)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

    )
  }

  useEffect(() => {
    GetData();
  }, []);

  useEffect(() => {
  }, [
    data,
    reload
  ]);

  return (
    <Container>

      {<MyNavBar location="admin" />}
      <h1 className="mt-2 mb-2"> Admin controls </h1>
      <hr></hr>

      <h2 className="mt-2 mb-2"> User awards </h2>
      <hr></hr>
      {data && <ListData />}

      <h2 className="mt-2 mb-2"> Create user </h2>
      <hr></hr>
      {<UserCreation />}
      <h2 className="mt-2 mb-2"> User accounts </h2>
      <hr></hr>
      {data && <ListUsers />}

    </Container>
  );
}
