import { useForm } from "react-hook-form";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  useToast,
  Divider,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { registerUser } from "../api/auth";
import { handleError } from "./errorHandler";
import UserContext from "../contexts/userContext";

interface FormData {
  username: string;
  password: string;
  email: string;
  passwordAgain: string;
}

export default function SignupForm() {
  const { handleSubmit, watch, errors, register, reset } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const { setUser } = useContext(UserContext);
  const history = useHistory();
  const toast = useToast();

  function onSubmit(values: FormData) {
    setSubmitting(true);
    const { passwordAgain, ...body } = values;

    registerUser(body)
      .then(
        (res) => {
          setUser(res.user);
          history.push("/");
        },
        (err) => {
          reset(Object.keys(values));
          handleError(toast, "Invalid username or email");
          setSubmitting(false);
        }
      )
  }

  return (
    <>
      <Heading textAlign="center">Create Account</Heading>
      <Divider m={4} />
      <Flex justify="center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.username}>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              name="username"
              placeholder="username"
              ref={register({ required: "Username is required" })}
            />
            <FormErrorMessage>
              {errors.username && errors.username.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              name="email"
              placeholder="example@mail.com"
              type="email"
              ref={register({
                required: "Email is required",
              })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              name="password"
              placeholder="password"
              type="password"
              ref={register({
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be 8 characters long",
                },
              })}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.passwordAgain}>
            <FormLabel htmlFor="passwordAgain">Type password again</FormLabel>
            <Input
              name="passwordAgain"
              placeholder="Password again"
              type="password"
              ref={register({
                required: "Type password again",
                validate: (value) => {
                  let error;
                  if (watch("password") !== value) {
                    error = "Passwords must match";
                  }

                  return error || true;
                },
              })}
            />
            <FormErrorMessage>
              {errors.passwordAgain && errors.passwordAgain.message}
            </FormErrorMessage>
          </FormControl>
          <Flex justify="center">
            <Button mt={4} isLoading={submitting} type="submit">
              Create
            </Button>
          </Flex>
        </form>
      </Flex>
    </>
  );
}
