import cors from "cors";
import express from "express";
import db from "./models/index.js";
import cookieParser from "cookie-parser";
import { Umzug, SequelizeStorage } from "umzug";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const { sequelize } = db;

import signupRoute from "./routes/signup.route.js";
import logoutRoute from "./routes/logout.route.js";
import indexRoute from "./routes/index.route.js";
import loginRoute from "./routes/login.route.js";
import todoRoute from "./routes/todo.route.js";
import userRoute from "./routes/user.route.js";

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New client connected, id =", socket.id);

  socket.on("joinUserRoom", (userId) => {
    if (!userId) return;
    const room = `user_${userId}`;
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// helper to broadcast only to users' room
export function broadcastTodoUpdate(userId, payload) {
  io.to(`user_${userId}`).emit("todosUpdated", payload);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// register route (pass io to routes that need it)
app.use(loginRoute);
app.use(indexRoute);
app.use(signupRoute);
app.use("/api", userRoute(io));
app.use("/todos", todoRoute(io));
app.use("/logout", logoutRoute);

const runMigrations = async () => {
  const umzug = new Umzug({
    migrations: { glob: "migrations/*.js" },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

  await umzug.up();
};

const PORT = process.env.PORT || 3001;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    await runMigrations();
    console.log("Migrations applied");

    server.listen(PORT, () =>
      console.log(`Server is listening on http://127.0.0.1:${PORT}`),
    );
  } catch (err) {
    console.error("Error starting server:", err);
  }
})();
