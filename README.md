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

# Socket.IO Complete Cheatsheet

A quick yet comprehensive reference for **all ways to send and receive events** in Socket.IO.

---

## 1. Understanding `io` vs `socket` (Server-side)

- **`io`** → The main server instance. Use it to send events to **all connected clients**, to a **room**, or to a specific **socket ID**.
- **`socket`** → Represents **one specific client connection**. Use it to send messages **only to that client**, or to broadcast to others.

---

## 2. Sending and Receiving Events

### **A. Client → Server** (`socket.emit` from client)

**Client:**

```js
// frontend.js
socket.emit("chatMessage", { text: "Hello server!" });
```

**Server:**

```js
// server.js
socket.on("chatMessage", (data) => {
  console.log("Received from client:", data);
});
```

- **Who receives?** Server only.
- **Use case:** User sends a chat message to the server.

---

### **B. Server → Client** (`socket.emit` from server)

**Server:**

```js
socket.emit("welcome", "Hello, this is a private welcome message!");
```

**Client:**

```js
socket.on("welcome", (msg) => {
  console.log(msg);
});
```

- **Who receives?** Only that connected client.
- **Use case:** Sending a private welcome message after connecting.

---

### **C. Server → All Clients** (`io.emit`)

**Server:**

```js
io.emit("announcement", "Server will restart in 5 minutes.");
```

**Client:**

```js
socket.on("announcement", (msg) => {
  console.log(msg);
});
```

- **Who receives?** Every connected client.
- **Use case:** Public announcements.

---

### **D. Server → All Except Sender** (`socket.broadcast.emit`)

**Server:**

```js
socket.broadcast.emit("userJoined", `${socket.id} joined the chat.`);
```

**Client:**

```js
socket.on("userJoined", (msg) => {
  console.log(msg);
});
```

- **Who receives?** All clients except the sender.
- **Use case:** Notify others when a new user joins.

---

### **E. Rooms: Joining & Leaving**

**Server:**

```js
socket.join("room1"); // Join
socket.leave("room1"); // Leave
```

- **Use case:** Group chats, game lobbies.

---

### **F. Emit to a Room**

**Server:**

```js
io.to("room1").emit("roomMessage", "Hello Room 1!");
```

**Client:**

```js
socket.on("roomMessage", (msg) => {
  console.log(msg);
});
```

- **Who receives?** Everyone in `room1`.
- **Use case:** Chat messages for a specific group.

---

### **G. Emit to a Room Except Sender**

**Server:**

```js
socket.to("room1").emit("roomMessage", "Someone else says hello!");
```

- **Who receives?** Everyone in `room1` except sender.
- **Use case:** Prevent echoing messages back to sender.

---

### **H. Private Messaging via Socket ID**

**Server:**

```js
io.to("some-socket-id").emit("privateMessage", "Hey! Just for you.");
```

**Client:**

```js
socket.on("privateMessage", (msg) => {
  console.log(msg);
});
```

- **Who receives?** The client with that socket ID.
- **Use case:** One-to-one chat.

---

### **I. Listening for Events**

**Server:**

```js
socket.on("typing", () => {
  console.log(`${socket.id} is typing...`);
});
```

**Client:**

```js
socket.on("userTyping", (user) => {
  console.log(`${user} is typing...`);
});
```

- **Use case:** Typing indicators.

---

## 3. Quick Reference Table

| Method                  | Location      | Who Receives              | Example Use Case            |
| ----------------------- | ------------- | ------------------------- | --------------------------- |
| `socket.emit`           | Client        | Server only               | Send form data to server    |
| `socket.emit`           | Server        | One client                | Private welcome message     |
| `io.emit`               | Server        | All clients               | Broadcast announcement      |
| `socket.broadcast.emit` | Server        | All except sender         | Notify others of join/leave |
| `socket.join(room)`     | Server        | N/A                       | Add client to room          |
| `socket.leave(room)`    | Server        | N/A                       | Remove client from room     |
| `io.to(room).emit`      | Server        | All in room               | Group message               |
| `socket.to(room).emit`  | Server        | All in room except sender | Avoid message echo          |
| `io.to(socketId).emit`  | Server        | One client by ID          | Direct private message      |
| `socket.on(event)`      | Client/Server | The one listening         | Handle incoming events      |

---

**Pro Tip:** Always namespace your events and avoid generic names like `message` to prevent conflicts in large apps.

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
