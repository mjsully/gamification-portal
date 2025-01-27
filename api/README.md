# Gamification portal API documentation

The API interacts with a SQLite database and provides CRUD. It uses the FastAPI web framework to provide the endpoints and SQLAlchemy to interact with the DB. The API endpoints are as follows:

- /users (GET, POST)
- /user/{id} (GET, PATCH, DELETE)
- /user/{id}/badges (GET, POST)
- /user/{id}/badge/{badgeid} (DELETE)
- /badges (GET, POST)
- /badge/{id} (GET, PATCH, DELETE)

Badges and users can be created, read, updated and deleted. Badges are assigned to a user in the user_badges DB table, allowing a one-to-many relationship. 