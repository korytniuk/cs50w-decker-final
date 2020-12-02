import React from "react";
import { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { RouteType } from "../config/routes";
import UserContext from "../contexts/userContext";

const AppRoutes: React.FC<RouteType> = ({
  path,
  component: Component,
  isPrivate,
  guest,
  ...rest
}) => {
  const { user } = useContext(UserContext);

  return (
    <Route
      key={path}
      path={path}
      render={(props) => {
        return isPrivate && !user ? (
          <Redirect to={{ pathname: "/login" }} />
        ) : guest && user ? (
          <Redirect to={{ pathname: "/" }} />
        ) : (
          <Component {...props} />
        );
      }}
      {...rest}
    />
  );
};

export default AppRoutes;
