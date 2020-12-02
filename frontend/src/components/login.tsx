import { useForm } from "react-hook-form";
import React, { useContext } from "react";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Flex,
  useToast,
  Stack,
} from "@chakra-ui/react";
import { loginUser } from "../api/auth";
import UserContext from "../contexts/userContext";
import { useHistory } from "react-router-dom";
import { handleError } from "./errorHandler";

interface LoginValues {
  username: string;
  password: string;
}

export default function LoginForm({ onClose }: { onClose?: () => void }) {
  const { handleSubmit, errors, register, formState } = useForm();
  const { setUser } = useContext(UserContext);
  const history = useHistory();
  const toast = useToast();

  //TODO refactor

  function validatePassword(value: String) {
    let error;
    if (!value) {
      error = "Password is required";
    }

    return error || true;
  }

  function validateUsername(value: String) {
    let error;
    if (!value) {
      error = "Username is required";
    }

    return error || true;
  }

  function onSubmit(values: LoginValues) {
    const { username, password } = values;
    loginUser(username, password)
      .then((res) => {
        //handle modal case
        if (typeof onClose === "function") {
          onClose();
        }
        setUser(res.user);
        history.push("/");
      })
      .catch((error) => {
        handleError(toast, "Invalid username or password!");
      });
  }

  return (
    <Flex justify="center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <FormControl isInvalid={errors.name}>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              name="username"
              placeholder="username"
              ref={register({ validate: validateUsername })}
            />
            <FormErrorMessage>
              {errors.username && errors.username.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              name="password"
              placeholder="password"
              type="password"
              ref={register({ validate: validatePassword })}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          <Flex justify="center">
            <Button
              mt={4}
              colorScheme="pink"
              isLoading={formState.isSubmitting}
              type="submit"
            >
              Login
            </Button>
          </Flex>
        </Stack>
      </form>
    </Flex>
  );
}
