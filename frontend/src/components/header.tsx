import React, { useContext } from "react";
import {
  Box,
  Heading,
  Flex,
  Text,
  Button,
  IconButton,
  Stack,
} from "@chakra-ui/react";
import { Link, useHistory } from "react-router-dom";
import { HamburgerIcon } from "@chakra-ui/icons";
import UserContext from "../contexts/userContext";
import { logoutUser } from "../api/auth";
import LoginModal from "./loginModal";

type IProps = {
  children: React.ReactNode;
  to?: string;
};

const MenuItems = ({ children, to = "/" }: IProps) => (
  <Text mt={{ base: 4, md: 0 }} mr={6} display="block">
    <Link to={to}>{children}</Link>
  </Text>
);

const Header = (props: any) => {
  const [show, setShow] = React.useState(false);
  const handleToggle = () => setShow(!show);
  const { user, setUser } = useContext(UserContext);
  const history = useHistory();
  const logout = () => {
    setUser(null);
    logoutUser();
    history.push("/login");
  };

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      bg="red.100"
      color="grey"
      {...props}
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" size="lg" letterSpacing={"-.1rem"}>
          Decker
        </Heading>
      </Flex>
      <Box display={{ sm: "block", md: "none" }} onClick={handleToggle}>
        <IconButton
          bg="transparet"
          border="1px"
          aria-label="toggle menu"
          icon={<HamburgerIcon />}
        />
      </Box>

      <Box
        display={{ sm: show ? "block" : "none", md: "flex" }}
        width={{ sm: "full", md: "auto" }}
        alignItems="center"
        flexGrow={1}
      >
        <MenuItems>Decks</MenuItems>
        <MenuItems to="/create">Create</MenuItems>
        <MenuItems to="/plays">Played Decks</MenuItems>
      </Box>

      <Box
        display={{ sm: show ? "block" : "none", md: "block" }}
        mt={{ base: 4, md: 0 }}
      >
        {user === null ? (
          <Stack direction="row">
            <LoginModal/>
            <Link to="/register">
              <Button bg="transparent" border="1px">
                Create account
              </Button>
            </Link>
          </Stack>
        ) : (
          <Button bg="transparent" border="1px" onClick={logout}>
            Logout
          </Button>
        )}
      </Box>
    </Flex>
  );
};


export default Header;
