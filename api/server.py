import logging
import os
from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import create_engine, delete, update
from sqlalchemy.dialects.sqlite import insert
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import sessionmaker

import models


@asynccontextmanager
async def lifespan(app: FastAPI):

    initialise()
    yield
    logging.debug("Exiting!")

app = FastAPI(lifespan=lifespan)
logging.basicConfig(level=logging.DEBUG)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

DB_FILEPATH = "data/database.db"


# Check necessary env variables exist and create user
def initialise():

    if not os.path.exists('data'):
        os.mkdir('data')
    if not os.path.exists('data/database.db'):
        logging.debug('DB does not exist!')
        create_database()
    else:
        logging.debug('DB exists, skipping creation')


# Define user validation
def user_validation(json, patch=False):

    if 'name' not in json.keys() and not patch:
        return False
    if 'admin' not in json.keys():
        return False
    if 'xp' not in json.keys():
        return False
    return True


# Define badge validaiton
def badge_validation(json):

    if 'name' not in json.keys():
        return False
    if 'description' not in json.keys():
        return False
    return True


# Use ORM to create database from models
def create_database():

    engine = create_engine(f"sqlite:///{DB_FILEPATH}")
    models.Base.metadata.create_all(engine)


def get_session():

    engine = create_engine(f"sqlite:///{DB_FILEPATH}")
    Session = sessionmaker(bind=engine)
    session = Session()
    return session


@app.get('/users')
async def users_get():

    """ Get all users """

    session = get_session()

    results = session.query(
        models.Users
    ).all()

    try:

        results_list = []
        for result in results:
            results_dict = {
                "id": result.id,
                "name": result.name,
                "admin": bool(result.admin),
                "xp": result.xp
            }
            results_list.append(results_dict)

        return JSONResponse(status_code=200, content=results_list)

    except Exception as e:

        logging.error(e)
        return JSONResponse(status_code=500, content=str(e))


@app.get('/user/{id}')
async def user_get(id: int):

    """ Get user with a specific ID """

    session = get_session()

    try:

        result = session.query(
            models.Users
        ).where(
            models.Users.id == id
        ).one_or_none()

        if result is None:
            return JSONResponse(status_code=404, content="No record in DB.")

        else:
            results_dict = {
                "id": result.id,
                "name": result.name,
                "admin": bool(result.admin),
                "xp": result.xp
            }

            return JSONResponse(status_code=200, content=results_dict)

    except Exception as e:

        logging.error(e)
        return JSONResponse(status_code=500, content=str(e))


@app.get('/user/{id}/badges')
async def user_badges_get(id: int):

    """ Get badges for a user with a specific ID """

    session = get_session()

    results = session.query(
        models.UserBadges
    ).where(
        models.UserBadges.userid == id
    ).all()

    try:

        results_list = []
        for result in results:
            results_dict = {
                "userid": result.userid,
                "badgeid": result.badgeid,
                "timestamp": result.timestamp.strftime("%d/%m/%Y")
            }
            results_list.append(results_dict)

        return JSONResponse(status_code=200, content=results_list)

    except Exception as e:

        logging.error(e)
        return JSONResponse(status_code=500, content=str(e))


@app.post('/user/{id}/badges')
async def user_badges_post(id: int, request: Request):

    """ Add badge to a user with a given ID """

    session = get_session()

    try:

        data = await request.json()

        if "badgeid" in data.keys():

            session.execute(
                insert(models.UserBadges).values(
                    userid=id,
                    badgeid=data["badgeid"],
                    timestamp=datetime.now()
                )
            )

            session.commit()
            session.close()
            return 200

        session.close()
        raise HTTPException(status_code=400, detail="Data was invalid")

    except SQLAlchemyError as e:

        session.close()
        logging.error(e)
        return JSONResponse(status_code=400, content="Something went wrong")


@app.delete('/users/{id}/badge/{badgeid}')
async def user_badge_delete(id: int, badgeid: int):

    """ Delete badge for a user with a given ID """

    session = get_session()

    try:
        session.execute(
            delete(
                models.UserBadges
            ).where(
                models.UserBadges.userid == id,
                models.UserBadges.badgeid == badgeid
            )
        )
        session.commit()
        session.close()
        return 200
    except Exception as e:
        logging.error(e)
        return 400


@app.patch('/user/{id}')
async def user_patch(id: int, request: Request):

    """ Patch existing user """

    session = get_session()

    try:

        data = await request.json()
        valid_data = user_validation(data, patch=True)

        if valid_data:
            session.execute(
                update(
                    models.Users
                ).where(
                    models.Users.id == id
                ).values(
                    admin=bool(data["admin"]),
                    xp=data["xp"]
                )
            )

            session.commit()
            session.close()
            return 200

        session.close()
        return 400

    except Exception as e:
        logging.error(e)
        return 400


@app.delete('/user/{id}')
async def user_delete(id: int):

    """ Delete user with a given ID """

    session = get_session()

    try:
        session.execute(
            delete(
                models.Users
            ).where(
                models.Users.id == id
            )
        )
        session.execute(
            delete(
                models.UserBadges
            ).where(
                models.UserBadges.userid == id
            )
        )
        session.commit()
        session.close()
        return 200
    except Exception as e:
        logging.error(e)
        return 400


@app.post('/users')
async def users_post(request: Request):

    """ Add a user to the DB """

    session = get_session()

    try:

        data = await request.json()
        valid_data = user_validation(data)

        if valid_data:

            session.execute(
                insert(models.Users).values(
                    name=data["name"],
                    admin=bool(data["admin"]),
                    xp=data["xp"]
                )
            )

            session.commit()
            session.close()
            return 200

        session.close()
        raise HTTPException(status_code=400, detail="Data was invalid")

    except SQLAlchemyError as e:

        session.close()
        logging.error(e)
        return JSONResponse(status_code=400, content="Something went wrong")


@app.get('/badges')
async def badges_get():

    """ Get all badges """

    session = get_session()

    results = session.query(
        models.Badges
    ).all()

    try:

        results_list = []
        for result in results:
            results_dict = {
                "id": result.id,
                "name": result.name,
                "description": result.description
            }
            results_list.append(results_dict)

        return JSONResponse(status_code=200, content=results_list)

    except Exception as e:

        logging.error(e)
        return JSONResponse(status_code=500, content=str(e))


@app.get('/badge/{id}')
async def badge_get(id: int):

    """ Get badge with a specific ID """

    session = get_session()

    try:

        result = session.query(
            models.Badges
        ).where(
            models.Badges.id == id
        ).one_or_none()

        if result is None:
            return JSONResponse(status_code=404, content="No record in DB.")

        results_dict = {
            "id": result.id,
            "name": result.name,
            "description": result.description
        }

        return JSONResponse(status_code=200, content=results_dict)

    except Exception as e:

        logging.error(e)
        return JSONResponse(status_code=500, content=str(e))


@app.patch('/badge/{id}')
async def badge_patch(id: int, request: Request):

    """ Patch existing badge """

    session = get_session()

    try:

        data = await request.json()
        valid_data = badge_validation(data)

        if valid_data:
            session.execute(
                update(
                    models.Badges
                ).where(
                    models.Badges.id == id
                ).values(
                    name=data["name"],
                    description=data["description"]
                )
            )

            session.commit()
            session.close()
            return 200

        session.close()
        return 400

    except Exception as e:
        logging.error(e)
        return 400


@app.delete('/badge/{id}')
async def badge_delete(id: int):

    """ Delete badge with a given ID """

    session = get_session()

    try:
        session.execute(
            delete(
                models.Badges
            ).where(
                models.Badges.id == id
            )
        )
        session.execute(
            delete(
                models.UserBadges
            ).where(
                models.UserBadges.badgeid == id
            )
        )
        session.commit()
        session.close()
        return 200
    except Exception as e:
        logging.error(e)
        return 400


@app.post('/badges')
async def badges_post(request: Request):

    """ Add badge to the DB """

    session = get_session()

    try:

        data = await request.json()
        valid_data = badge_validation(data)

        if valid_data:

            session.execute(
                insert(models.Badges).values(
                    name=data["name"],
                    description=data["description"]
                )
            )

            session.commit()
            session.close()
            return 200

        session.close()
        raise HTTPException(status_code=400, detail="Data was invalid")

    except SQLAlchemyError as e:

        session.close()
        logging.error(e)
        return JSONResponse(status_code=400, content="Something went wrong")


if __name__ == '__main__':
    initialise()
