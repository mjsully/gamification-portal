# Gamification portal

## Overview
This app is a Docker compose application built using two components; an API and a frontend. The API is a Python-based API, using FastAPI to provide the HTTP endpoints. It leverages SQLAlchemy connected to a SQLite DB to store all user data. The frontend is built using React, Bootstrap and Next.JS. 
## Installation
First, install docker-compose using the official docs. To run the application, do the following:
```
docker compose up -d --build
```
Once the build has completed, you should be able to access the frontend on your local machine at http://localhost:3000/
## Screenshots
### Homepage / leaderboard
![image](https://github.com/mjsully/gamification-portal/blob/main/screenshots/leaderboard-page.png)
### User information page
![image](https://github.com/mjsully/gamification-portal/blob/main/screenshots/user-page.png)
### Admin control panel
![image](https://github.com/mjsully/gamification-portal/blob/main/screenshots/admin-page.png)
