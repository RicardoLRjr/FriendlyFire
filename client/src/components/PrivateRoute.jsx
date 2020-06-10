import React from "react";
import jwt from "jsonwebtoken";

import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ props:props, component: Component, ...rest }) => {
  const checkForToken = () => {
    var decoded = jwt.verify(
      sessionStorage.getItem("jwt"),
      process.env.REACT_APP_SECRET_KEY
    );
    if (decoded.id === Number(rest.computedMatch.params.id)) {
      return true;
    } else {
      return false;
    }
  };

  if (checkForToken()) {
    return <Route {...rest} render={(props) => <Component logOutUser={rest.logOutUser} {...props} />} />;
  } else {
    return <Redirect to="/" />;
  }
};

export default PrivateRoute;
