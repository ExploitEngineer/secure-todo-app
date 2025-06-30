const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { sequelize } = require("./models");
const { Umzug, SequelizeStorage } = require("umzug");

const indexRoute = require("./routes/index.route");
const signupRoute = require("./routes/signup.route");
const loginRoute = require("./routes/login.route");
const todoRoute = require("./routes/todo.route");
const userRoute = require("./routes/user.route");
const logoutRoute = require("./routes/logout.route");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Frontend origin
    credentials: true, // Allow cookies to be sent
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use(indexRoute);
app.use(signupRoute);
app.use(loginRoute);
app.use("/todos", todoRoute);
app.use("/api", userRoute);
app.use("/logout", logoutRoute)

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

    app.listen(PORT, () =>
      console.log(`Server is running on http://127.0.0.1:${PORT}`)
    );
  } catch (err) {
    console.error("Error starting server:", err);
  }
})();
