# Secure Todo App

A secure and modern full-stack Todo application built with React, TailwindCSS, Express.js, SQLite, and Sequelize ORM. Features user authentication with JWT and password hashing via bcrypt. Designed for security, performance, and a clean developer experience.

## Features

* ✅ JWT-based Authentication
* 🔐 Password hashing with bcrypt
* 📋 CRUD for Todos
* 📦 SQLite database via Sequelize ORM
* 🎨 TailwindCSS for UI styling
* ⚛️ React Frontend
* ⚙️ Express.js Backend
* 🧪 Secure and scalable folder structure

## Technologies Used

### Frontend

* React
* TailwindCSS

### Backend

* Node.js
* Express.js
* Sequelize ORM
* SQLite
* JWT (jsonwebtoken)
* bcryptjs

## Getting Started

### Prerequisites

* Node.js & npm

### Installation

```bash
# Clone the repository
$ git clone https://github.com/your-username/secure-todo-app.git

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
$ cd server
$ npm run dev
```

#### Start Frontend

```bash
$ cd client
$ npm start
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

* Passwords hashed with `bcrypt`
* JWT-based session management
* Protected routes on both frontend & backend
* Secure API design practices

## License

This project is open-source and available under the [MIT License](LICENSE).

---

> Made with ❤️ by ExploitEngineer
