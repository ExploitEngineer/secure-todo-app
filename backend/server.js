import cors from "cors";
import express from "express";
import { sequelize } from "./models";
import cookieParser from "cookie-parser";
import { Umzug, SequelizeStorage } from "umzug";
import http from "http";

require("dotenv").config();

import signupRoute from "./routes/signup.route";
import logoutRoute from "./routes/logout.route";
import indexRoute from "./routes/index.route";
import loginRoute from "./routes/login.route";
import todoRoute from "./routes/todo.route";
import userRoute from "./routes/user.route";

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173", // Frontend origin
    credentials: true, // Allow cookies to be sent
  }),
);
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
      console.log(`Server is running on http://127.0.0.1:${PORT}`),
    );
  } catch (err) {
    console.error("Error starting server:", err);
  }
})();
