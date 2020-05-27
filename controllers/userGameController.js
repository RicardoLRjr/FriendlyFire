const express = require("express");
const router = express.Router();
const db = require("../models");
const { Op } = require("sequelize");

router.post("/", (req, res) => {
  const newUserGame = {
    gameId: req.body.gameId,
    userId: req.body.userId,
  };
  db.UserGame.create(newUserGame)
    .then(() => {
      res.json([
        newUserGame,
        {
          success: true,
        },
      ]);
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
      res.json({
        success: false,
        message: "Failed to create UserGame.",
      });
    });
});

router.delete("/:gameId/:userId", (req, res) => {
  db.UserGame.destroy({
    where: {
      gameId: req.params.gameId,
      userId: req.params.userId,
    },
  })
    .then(() => {
      res.json({
        success: true,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
      res.json({
        success: false,
        message: "Failed to delete UserGame.",
      });
    });
});

//get all users that own a game
router.get("/users/:id", (req, res) => {
  db.UserGame.findAll({
    where: {
      gameId: req.params.id,
    },
    include: [
      {
        model: db.User,
        attributes: ["id", "email", "handle", "discord"],
      },
    ],
  })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

router.post("/filterByGame/:id", (req, res) => {
  console.log(req.body.friends);
  db.UserGame.findAll({
    where: {
      [Op.and]: [
        { gameId: req.params.id },
        { [Op.or]: req.body.friends },
      ],
    },
    include: [
      {
        model: db.User,
        attributes: ["id", "email", "handle", "discord"],
      },
    ],
  })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

//get all owned games route
router.get("/:id", (req, res) => {
  db.User.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: db.Game,
        attributes: ["id", "name", "platform"],
      },
    ],
  })
    .then((result) => {
      res.json(result.Games);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

module.exports = router;
