import React, { Component } from "react";
import axios from "axios";
import GameCard from "../../components/GameCard/GameCard";
import "./AboutMe.css"

class AboutMe extends Component {
  state = {
    discordName: "",
    gameResults: [],
    friendResults: []
  };
// importing componentDidMount from dashboard.js
  componentDidMount(){
    axios
    .get(`/api/friend/${this.props.match.params.id}`)
    .then((response) => {
      this.setState({
        friendResults: response.data,
        searchFriendResults: response.data,
      });
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
  axios
    .get(`/api/usergame/${this.props.match.params.id}`)
    .then((response) => {
      this.setState({ gameResults: response.data });
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
  axios
    .get(`/api/user/${this.props.match.params.id}`)
    .then((userResponse) => {
      this.setState({ userName: userResponse.data.handle });
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
}

  pageChanger = (event) => {
    window.location.href=`/dashboard/${this.props.match.params.id}`
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

   handleSubmitUser = (event) => {
    event.preventDefault();
    axios
      .put(`/api/user/${this.props.match.params.id}`, {
        discord: this.state.discordName,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const search = this.state.search;
    axios.get(`https://api.rawg.io/api/games?search=${search}`).then((res) => {
      const gameArray = res.data.results.map((rawGame) => {
        return this.createGameObj(rawGame);
      });
      this.setState({ gameResults: gameArray });
    });
  };

  createGameObj = (rawGame) => {
    const platforms = this.filterPlatforms(rawGame.platforms);
    const newGame = {
      name: rawGame.name,
      platform: platforms,
      imgURL: rawGame.background_image,
    };
    return newGame;
  };

  filterPlatforms = (platforms) => {
    let platformArray = [];
    for (var i = 0; i < platforms.length; i++) {
      switch (platforms[i].platform.name) {
        case "PC":
        case "Linux":
        case "macOS":
          if (!platformArray.includes("PC")) {
            platformArray.push("PC");
          }
          break;
        case "PlayStation 4":
        case "PlayStation 3":
        case "PlayStation 2":
        case "PlayStation":
          if (!platformArray.includes("PlayStation")) {
            platformArray.push("PlayStation");
          }
          break;
        case "Xbox One":
        case "Xbox 360":
        case "Xbox":
          if (!platformArray.includes("Xbox")) {
            platformArray.push("Xbox");
          }
          break;
        case "Nintendo Switch":
          if (!platformArray.includes("Nintendo Switch")) {
            platformArray.push("Nintendo Switch");
          }
          break;
        default:
          break;
      }
    }
    return platformArray;
  };

  saveGame = async (game) => {
    let gameId;
    await axios
      .get(`/api/game?name=${game.name}&platform=${game.platform}`)
      .then(async (gameExists) => {
        if (!gameExists.data) {
          await axios
            .post("/api/game", game)
            .then(async () => {
              console.log("succes");
              await axios.get(`/api/game/?name=${game.name}&platform=${game.platform}`).then((gameNameRes)=>{
                gameId=gameNameRes.data.id;
              })
            })
            .catch((er) => console.log(er));
        } else {
          gameId = gameExists.data.id;
        }
      });
    await axios.post("/api/usergame", {gameId: gameId, userId: this.props.match.params.id}).then(()=>console.log("game saved")).catch(er=>console.log(er));
  };

  deleteAccount = () => {
    console.log("deleting...");
    axios.delete(`/api/user/${this.props.match.params.id}`).then(()=>{
      window.location.href="/";
      this.props.logOutUser();
    })
  }

  render() {
    return (
      <div className="container center">
        <h3 id="FFheadText"> {this.state.userName}'s account page </h3>
        <br />
        <div className="row">
          <form className="col s12 center" onSubmit={this.handleSubmitUser}>
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">gamepad</i>
                <input id="icon_gamepad" 
                type="text" 
                name="discordName"
                onChange={this.handleChange}/>
                <label for="icon_gamepad">Discord Username</label>
                <button
                  className="btn waves-effect waves-light"
                  id="ButtonColor"
                  type="submit"
                  name="action"
                >
                 Submit
                  <i className="material-icons right">account_box</i>
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="container center">
          <h3>Add your games to your profile!</h3>
          <form className="col s12" onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="input-field col offset-s4 s4">
                <input
                  id="add_a_game"
                  type="text"
                  name="search"
                  onChange={this.handleChange}
                />
                <label for="add_a_game">Search Game here</label>
                <button
                  className="btn waves-effect waves-light"
                  id="ButtonColor"
                  type="submit"
                  name="action"
                >
                  Find Game<i className="material-icons right">search</i>
                </button>
              </div>
            </div>
          </form>
        </div>

        {this.state.gameResults.map(({ genre, imgURL, name, platform }) => {
          return (
            <GameCard
              imgURL={imgURL}
              name={name}
              platform={platform}
              saveGame={this.saveGame}
            />
          );
        })}
        <div className="row">
          <button
            className="btn waves-effect waves-light"
            id="ButtonColor"
            type="submit"
            name="action"
            onClick={this.pageChanger}
          >
            Done! Go Find Friends!
            <i className="material-icons right">send</i>
          </button>
        </div>
        <div className="row">
        <button class="waves-effect waves-light btn DANGER" onClick={this.deleteAccount}><i class="material-icons right">delete_forever</i><span className="delete-text"></span></button>
        </div>
      </div>
    );
  }
}


export default AboutMe;
