import React, { Component } from "react";
import FriendList from "../../components/friendHandler/friendList";
import axios from "axios";
import GamesList from "../../components/GamesList";
import Select from "react-select";

class Dashboard extends Component {
  state = {
    userName: "",
    friendResults: [],
    searchFriendResults: [],
    gameResults: [],
    searchGame: "",
    searchName: "",
    searchBy: "",
    id: "",
  };

  componentDidMount() {
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

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleSubmitName = (event) => {
    event.preventDefault();
    if (this.state.searchName === "") {
      this.setState({ searchFriendResults: this.state.friendResults });
    } else {
      const filteredUsers = this.state.friendResults.filter((friend) =>
        friend.handle.includes(this.state.searchName)
      );
      this.setState({ searchFriendResults: filteredUsers });
      this.setState({ searchBy: " by Name"});
    }
  };

  handleSubmitGame = (event) => {
    event.preventDefault();
    const searchGame = this.state.searchGame;
    const friends = this.state.friendResults.map(friend=>{
      return {userId: friend.id}
    })
    axios
      .post(`/api/usergame/filterByGame/${searchGame}`,{friends: friends})
      .then((response) => {
        console.log(response.data);
        const userArray = response.data.map(user=>{
          return user.User;
        })
        this.setState({ searchFriendResults: userArray});
        this.setState({ searchBy: " by Game"});
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  };

  deleteGame = (gameId) => {
    axios
      .delete(`/api/userGame/${gameId}/${this.props.match.params.id}`)
      .then(() => {
        console.log("game deleted");
        axios
          .get(`/api/usergame/${this.props.match.params.id}`)
          .then((response) => {
            console.log(response.data);
            this.setState({ gameResults: response.data });
          })
          .catch((err) => {
            if (err) {
              console.log(err);
            }
          });
      })
      .catch((er) => console.log(er));
  };


  deleteFriend = (friendId) => {
    axios
      .delete(`/api/friend/${friendId}/${this.props.match.params.id}`)
      .then(() => {
        console.log("friend deleted");
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
      })
      .catch((er) => console.log(er));
  };

  handleSelectChange = (selectedOption) => {
    this.setState({ searchGame: selectedOption.value });
  };

  render() {
    return (
      <div className="container center">
        <h4 id="FFheadText">{this.state.userName}'s Dashboard</h4>
        <br />
        <div className="row">
          <h5 id="FFheadText">
            Search your friends list{this.state.searchBy}
          </h5>
          <form className="col s3 offset-s1" onSubmit={this.handleSubmitName}>
            <div className="row">
              <div className="input-field">
                <input
                  id="search_by_name"
                  type="text"
                  name="searchName"
                  onChange={this.handleChange}
                />
                <label for="search_by_name">Search By Name</label>
                <button
                  className="btn waves-effect waves-light"
                  id="ButtonColor"
                  type="submit"
                  name="action"
                >
                  Search
                  <i className="material-icons right">search</i>
                </button>
              </div>
            </div>
          </form>
          <form className=" col s3 offset-s4" onSubmit={this.handleSubmitGame}>
            <div className="row">
              <div className="input-field">
              <Select
                className="gameSelect"
                styles={{
                  menu: (provided) => ({ ...provided, zIndex: 9999, color: "black", background: "#34608d" }),
                  menuList: (provided) => ({...provided, background: "#34608d"}),
                  control: (provided) => ({...provided, background: "#34608d", minHeight: 32}),
                  container: (provided) => ({...provided, background: "#34608d"}),
                  placeholder: (provided) => ({...provided, color: "#d8dae7"}),
                  input: (provided) => ({...provided, color: "#d8dae7"}),
                  dropdownIndicator: (provided) => ({...provided, color: "#d8dae7"}),
                  selectedOption: (provided) => ({...provided, color: "#d8dae7"}),
                  singleValue: (provided) => ({...provided, color: "#d8dae7"}),
                }}
                onChange={this.handleSelectChange}
                options={this.state.gameResults.map((game) => {
                  const option = {
                    value: game.id,
                    label: `${game.name} | ${game.platform}`,
                  };
                  return option;
                })}
                placeholder="Search By Game"
              />
                <button
                  className="btn waves-effect waves-light"
                  id="ButtonColor"
                  type="submit"
                  name="action"
                >
                  Search
                  <i className="material-icons right">search</i>
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="row">
        <h3>Friends List</h3>
        <table className="centered highlight bordered">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Discord Name</th>
              <th>Remove</th>
            </tr>
          </thead>
          <FriendList
            friendResults={this.state.searchFriendResults}
            saveButton={false}
            deleteButton={true}
            deleteFriend={this.deleteFriend}
          />
        </table>
        </div>
        <div className="row">
        <h3>Your Games</h3>
        <table className="centered highlight bordered">
      <thead>
        <tr>
          <th>Game ID</th>
          <th>Game</th>
          <th>Platform</th>
          <th>Remove</th>
        </tr>
      </thead>
        <GamesList
          games={this.state.gameResults}
          deleteGame={this.deleteGame}
        />
      </table>
        </div>
      </div>
    );
  }
}

export default Dashboard;
