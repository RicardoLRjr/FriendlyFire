require("dotenv").config();
const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

const db = require("./models");
const UserController = require("./controllers/userController");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api/config", (req, res) => {
  res.json({
    success: true,
  });
});

app.use("/api/user", UserController);

// db.sequelize.sync({force: true}).then(function () {
db.sequelize.sync().then(function () {
  app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`);
  });
});
