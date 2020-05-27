import React from "react";
import Friend from "./friend";

const FriendList = (props) => {
  return (
    <tbody>
      {props.friendResults.map((friendResults) => (
        <Friend
          {...friendResults}
          key={friendResults.id}
          id={friendResults.id}
          Username={friendResults.handle}
          discordName={friendResults.discord}
          saveButton={props.saveButton}
          addFriend={props.addFriend}
          deleteButton={props.deleteButton}
          deleteFriend={props.deleteFriend}
        />
      ))}
    </tbody>
  );
};

export default FriendList;
