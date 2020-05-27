import React from "react";

const GamesList = (props) => {
  return (
      <tbody>
        {props.games.map((game) => {
          return (
            <tr>
              <td>{game.id}</td>
              <td>{game.name}</td>
              <td>{game.platform}</td>
              <td>
                <button
                  className="waves-effect waves-light btn save"
                  id="removeFriends"
                  type="submit"
                  onClick={() => props.deleteGame(game.id)}
                >
                  <i className="material-icons">delete</i>
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
  );
};

export default GamesList;
