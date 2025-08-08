# Secure Todo App

A secure and modern full-stack Todo application built with React, TailwindCSS, Express.js, SQLite, and Sequelize ORM. Features user authentication with JWT and password hashing via bcrypt. Designed for security, performance, and a clean developer experience.

## Features

- ✅ JWT-based Authentication
- 🔐 Password hashing with bcrypt
- 📋 CRUD for Todos
- 📦 SQLite database via Sequelize ORM
- 🎨 TailwindCSS for UI styling
- ⚛️ React Frontend
- ⚙️ Express.js Backend
- 🧪 Secure and scalable folder structure
- real-time communication using socket.io

## Technologies Used

### Frontend

- React
- TailwindCSS
- socket.io-client

### Backend

- Node.js
- Express.js
- Sequelize ORM
- SQLite
- JWT (jsonwebtoken)
- bcryptjs
- socket.io

## Getting Started

### Prerequisites

- Node.js & npm

## Introduction to Socket.IO

Socket.IO is a JavaScript library that makes real-time, bidirectional communication between browsers (or other clients) and a Node.js server easy. It gives you event-based sockets with lots of useful features (auto reconnect, rooms, namespaces, fallbacks) so you can build chat apps, live dashboards, multiplayer games, notifications, collaborative editors, etc.

## What Socket.IO is

- A client + server library for realtime messaging (JS on both browser and Node).
- Wraps a protocol on top of WebSocket and HTTP long-polling — exposing a nice event-based API: `socket.emit('myEvent', data)` and `socket.on('myEvent', handler)`.
- Adds features **WebSocket alone does not** provide out of the box: automatic reconnection, heartbeats, acknowledgement callbacks, rooms, namespaces, and a small framing/protocol layer.

### Key takeaways

- Socket.IO = event-driven realtime library (client + server).
- Adds reliability & higher-level features beyond raw WebSockets.

### Installation

```bash
# Clone the repository
$ git clone https://github.com/ExploitEngineer/secure-todo-app.git

# Navigate into the project directory
$ cd secure-todo-app

# Install backend dependencies
$ cd server
$ npm install

# Setup SQLite DB (optional: seed data)
$ npx sequelize-cli db:migrate
$ cd ..

# Install frontend dependencies
$ cd client
$ npm install
```

### Running the App

#### Start Backend

```bash
cd server
npm run dev
```

#### Start Frontend

```bash
cd client
npm start
```

## Folder Structure

```bash
secure-todo-app/
├── client/          # React frontend
│   └── ...
├── server/          # Express backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── ...
└── README.md
```

## Security Highlights

- Passwords hashed with `bcrypt`
- JWT-based session management
- Protected routes on both frontend & backend
- Secure API design practices

## License

This project is open-source and available under the [MIT License](LICENSE).

---

> Made with ❤️ by ExploitEngineer
