module.exports = function (sequelize, DataTypes) {
    const UserGame = sequelize.define(
      "UserGame",
      {
        gameId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
      },
    );
    UserGame.associate = function (models) {
      UserGame.belongsTo(models.User, {foreignKey: "userId"});
      UserGame.belongsTo(models.Game, {foreignKey: "gameId"});
    };
    return UserGame;
  };
  