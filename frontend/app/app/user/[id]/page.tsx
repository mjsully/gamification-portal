"use client";

import LevelCalculator from '../../levelCalculator'
import MyNavBar from '../../myNavBar'

import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';

import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'next/navigation'

export default function Home() {

  const params = useParams();

  const [userData, setUserData] = useState(null);
  const [badgeData, setBadgeData] = useState(null);

  function GetUserData() {

    fetch(`/api/user/${params["id"]}`)
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
      })
      .catch((err) => {
        console.log(err)
      })

  }

  function GetBadgeData() {

    fetch(`/api/user/${params["id"]}/badges`)
      .then((response) => response.json())
      .then((data) => {
        setBadgeData(data);
      })
      .catch((err) => {
        console.log(err)
      })

  }

  function ListUserData() {

    return (
      <div>
        <Row>
          <h2 className="mt-2 mb-2"> User stats </h2>
        </Row>
        <hr></hr>
        <p> Level: {LevelCalculator(userData).currentLevel} </p>
        <p> XP: {LevelCalculator(userData).currentXp} </p>
        <p> Next level XP: {LevelCalculator(userData).nextLevelXp} </p>
      </div>
    )

  }

  function ListBadgeData() {

    
    // if (badgeData.length > 0) {
    //   return (
    //     <Container>
    //       {badgeData.map((user) => (
    //         <p>
    //           {user.id}
    //         </p>
    //       ))}
    //     </Container>
    //   )
    // }

    return (
      <div>
        <p> No badge data available </p>
      </div>
    )



  }

  useEffect(() => {
    GetUserData();
    GetBadgeData();
  }, []);

  return (
    <Container>

      {<MyNavBar location="home" />}
      {
        userData &&
        <h1 className="mt-2 mb-2"> {userData.name} </h1>
      }
      <hr></hr>
      {userData && <ListUserData />}
      <Row>
        <h2 className="mt-2 mb-2"> Badges </h2>
      </Row>
      <hr></hr>
      {badgeData && <ListBadgeData />}


    </Container>
  );
}
