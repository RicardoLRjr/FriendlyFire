import React, { Component } from "react";
import FriendList from "../../components/friendHandler/friendList";
import axios from "axios";
import Select from "react-select";
import "./FindFriend.css";
class FindFriend extends Component {
  state = {
    friendResults: [],
    friendsToShow: [],
    searchGame: "",
    searchName: "",
    usersGames: [],
    searchBy: "",
  };

  componentDidMount() {
    axios.get(`/api/usergame/${this.props.match.params.id}`).then((res) => {
      this.setState({
        usersGames: res.data,
      });
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

  handleSelectChange = (selectedOption) => {
    this.setState({ searchGame: selectedOption.value });
  };

  addFriend = (friendId) => {
    console.log("ADD FRIEND!");
    console.log(friendId);
    axios
      .post("/api/friend", {
        user1Id: this.props.match.params.id,
        user2Id: friendId,
      })
      .then(() => console.log("friend added"))
      .catch((er) => console.log(er));
  };

  handleSubmitName = (event) => {
    event.preventDefault();
    const searchName = this.state.searchName;
    axios
      .get(`/api/friend/find?name=${searchName}`)
      .then((response) => {
        console.log(response.data);
        // debugger
        this.setState({ friendResults: [response.data] }
          );
          this.setState({searchBy: "Name"});
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  };

  handleSubmitGame = (event) => {
    event.preventDefault();
    const searchGame = this.state.searchGame;
    axios
      .get(`/api/usergame/users/${searchGame}`)
      .then((response) => {
        console.log(response.data);
        const userArray = response.data.map(user=>{
          return user.User;
        })
        this.setState({ friendResults: userArray});
        this.setState({ searchBy: "Game"});
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  };

  render() {
    return (
      <div className="container center">
        <div className="row">
          <h5 id="FFheadText">Search for a new friend!</h5>
        </div>
        <div className="row">
          <form className="col s3 offset-s1" onSubmit={this.handleSubmitName}>
            <div class="input-field col">
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
          </form>
          <form className="col s3 offset-s4" onSubmit={this.handleSubmitGame}>
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
                options={this.state.usersGames.map((game) => {
                  const option = {
                    value: game.id,
                    label: `${game.name} | ${game.platform}`,
                  };
                  return option;
                })}
              />
            </div>
            <div>
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
          </form>
          <h4 className="center">Results by {this.state.searchBy}:</h4>
          <table className="centered highlight bordered">
            <thead>
              <tr>
                <th>User's ID</th>
                <th>Username</th>
                <th>Discord Name</th>
                <th>Add Friend</th>
              </tr>
            </thead>
            <FriendList
              friendResults={this.state.friendResults}
              saveButton={true}
              addFriend={this.addFriend}
            />
          </table>
          <a
            className="waves-effect waves-light btn"
            id="ButtonColor"
            onClick={this.pageChanger}
              >
            <i className="material-icons left">arrow_back</i>Back to the
            dashboard
          </a>
        </div>
      </div>
    );
  }
}
export default FindFriend;
