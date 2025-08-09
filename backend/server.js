import cors from "cors";
import express from "express";
import db from "./models/index.js";
import cookieParser from "cookie-parser";
import { Umzug, SequelizeStorage } from "umzug";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

const { sequelize } = db;

dotenv.config();

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
    origin: "http://localhost:5173", // Frontend origin
    credentials: true, // Allow cookies to be sent
  })
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use(loginRoute);
app.use(indexRoute);
app.use(signupRoute);
app.use("/api", userRoute);
app.use("/todos", todoRoute);
app.use("/logout", logoutRoute);

io.on("connection", (socket) => {
  console.log("New client connected, id =", socket.id);
});

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
      console.log(`Server is running on http://127.0.0.1:${PORT}`)
    );
  } catch (err) {
    console.error("Error starting server:", err);
  }
})();
