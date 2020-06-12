require("dotenv").config();
const path = require("path")
const express = require("express");

const PORT = process.env.PORT || 3002;

const app = express();

const db = require("./models");
const UserController = require("./controllers/userController");
const GameController = require("./controllers/gameController")
const AuthController = require("./controllers/authController")
const FriendController = require("./controllers/friendController")
const UserGameController = require("./controllers/userGameController");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api/config", (req, res) => {
  res.json({
    success: true,
  });
});

app.use("/api/user", UserController);
app.use("/api/game", GameController);
app.use("/api/auth", AuthController);
app.use("/api/friend", FriendController);
app.use("/api/usergame", UserGameController);

app.use(express.static("client/build"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});



// db.sequelize.sync({force: true}).then(function () {
db.sequelize.sync().then(function () {
  app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`);
  });
});
