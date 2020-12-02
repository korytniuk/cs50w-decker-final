import React, { useState } from "react";
import routes from "./config/routes";
import "./App.css";
import { Box, Container } from "@chakra-ui/react";
import { Switch } from "react-router-dom";
import { logoutUser, USERNAME } from "./api/auth";
import UserContext from "./contexts/userContext";
import Header from "./components/header";
import AppRoutes from "./components/AppRoutes";

function App() {
  //initial state
  const [user, setUser] = useState(window.localStorage.getItem(USERNAME));

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user: user, setUser: setUser }}>
      <Box>
        <Header />
        <Main />
      </Box>
    </UserContext.Provider>
  );
}

function Main() {
  return (
    <Container minH="85vh" maxW="md">
      <Switch>
        {routes.map((options) => (
          <AppRoutes key={options.path} {...options} />
        ))}
      </Switch>
    </Container>
  );
}

export default App;
