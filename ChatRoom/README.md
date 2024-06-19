# Chat Room App

Simple chat room app built with MERN (MongoDB, Express, React, NodeJS) stack. The messaging backend is built with SocketIO.

## Comments

This application is designed and implemented with only completion in mind. In other words, little is done in terms of cybersecurity, e.g. Setting no password for mongoDB, storing password as plaintext in the database, storing user information in local storage etc. I would have attempted some of the above if given more time. Some potential improvements in the future include: Hashing the password in the database, using JWT (JSON Web Token) as Cookie for authentication, input validation in all possible input slots to prevent injection attacks etc.

Another thing I could improve on: in the Votes database, an individual message is uniquely identified by its timestamp and room. This could be problematic when there are a large amount of users sending messages at the same time. While this is very rare, two users could send a message at the exact nanosecond, causing a collision. The best way is to give messages an autoincrementing ID.

## Functionalities

1. Authentication: signup, login and logout.
    a. Signup will fail if username already exists in DB.
    b. Login will fail if either username or username/password pair cannot be found.
    c. Your username will be stored in local storage for persistent login.
    d. Pressing logout will remove your username from local storage.
2. Select chat room to join.
3. Send, upvote or downvote messages.
    a. Messages, upvote and downvote numbers are all synced on different users. The databases for message and votes are updating asynchronously in the backend.
    b. A list of users currently in the room will be displayed.

## Run

### Deployment with containerized backend

Make sure that Docker Daemon is on and updated

To build and run Docker backend:

```bash
cd backend
docker-compose build
docker-compose up
```

To build and run frontend:
```bash
cd frontend
docker build -t frontend-app .
docker run -p 5173:5173 frontend-app
```

You can now run and access the frontend (see above) on localhost:5173 and communicate with the backend.

