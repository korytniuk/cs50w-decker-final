import { DeleteIcon } from "@chakra-ui/icons";
import {
  Stack,
  Flex,
  Input,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Button,
  Text,
  InputGroup,
  InputRightElement,
  IconButton,
  Kbd,
  FormErrorMessage,
  Box,
  Heading,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { createDeck } from "../api/rest";
import { addServerErrors } from "./errorHandler";

interface FormData {
  title: string;
  tags: string;
  cards: string[];
}

const DeckForm: React.FC = () => {
  const { register, handleSubmit, errors, setError } = useForm();
  const [cards, setCards] = useState<string[]>([]);
  const [cardContent, setCardContent] = useState<string>("");
  const [isInvalidCard, setInvalidCard] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const history = useHistory();

  // add cards on Enter key press
  const handleKeyPress = (e: any) => {
    if (e.key === "Enter" && cardContent) {
      e.preventDefault();
      if (isInvalidCard) {
        return;
      }
      const newCards = [...cards];
      newCards.unshift(cardContent);
      setCardContent("");
      setCards(newCards);
    }
  };

  const handleChange = (e: any) => {
    setCardContent(e.target.value);
    if (cards.includes(e.target.value)) {
      setInvalidCard(true);
      return;
    }
    setInvalidCard(false);
  };

  const deleteCard = (index: number) => {
    const newCards = [...cards];
    newCards.splice(index, 1);
    setCards(newCards);
  };

  const onSubmit = (values: FormData) => {
    setSubmitting(true);
    console.log(values, cards);
    const data = {
      ...values,
      cards,
      tags: values.tags.split(",").map((x) => x.trim()),
    };
    console.log(data);
    createDeck(data)
      .then((res) => {
        history.push(`/decks/${res.id}`);
      })
      .catch((error) => {
        //handle server error
        if (error.response && error.response.data) {
          addServerErrors(error.response.data, setError);
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Box mt={3}>
      <Heading mb={2} textAlign="center">
        Create Deck
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <FormControl isInvalid={errors.title}>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input
              name="title"
              placeholder="Card's Title"
              ref={register({ required: "Title is required", minLength: 2 })}
            />
            <FormErrorMessage>
              {errors.title && errors.title.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.tags}>
            <FormLabel>Tags</FormLabel>
            <InputGroup size="sm">
              <Input
                name="tags"
                ref={register({ required: "This field is required" })}
                placeholder="Write tags, separte them with commas. E.g. cars, toys, children"
              />
            </InputGroup>
            {errors.tags && <Text>This field is required</Text>}
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="card-content">Card's content</FormLabel>

            <InputGroup>
              <Input
                onKeyPress={handleKeyPress}
                value={cardContent}
                onChange={handleChange}
                isInvalid={isInvalidCard}
                type="text"
                id="card-content"
                aria-describedby="card-helper-text"
              />
              <InputRightElement width="4.5rem"></InputRightElement>
            </InputGroup>
            <FormHelperText>
              Type and press <Kbd>Enter</Kbd> to insert a new card
            </FormHelperText>
            <FormHelperText
              display={isInvalidCard ? "show" : "none"}
              color="red.400"
              id="card-helper-text"
            >
              Card's name must be unique
            </FormHelperText>
          </FormControl>
          <Button isLoading={submitting} background="red.100" type="submit">
            Submit
          </Button>
          {cards.length ? <Divider /> : null}
          <Flex wrap="wrap" color="grey">
            {cards.map((card, i) => (
              <Card key={i} i={i} handleClick={deleteCard} cardContent={card} />
            ))}
          </Flex>
        </Stack>
      </form>
    </Box>
  );
};

type CardProps = {
  handleClick: any;
  i: number;
  cardContent: string;
};

const Card: React.FC<CardProps> = ({ handleClick, i, cardContent }) => {
  return (
    <Flex
      direction="row"
      justify="space-between"
      p={2}
      m={1}
      shadow="md"
      wrap="wrap"
      borderWidth="1px"
    >
      <Flex align="center">{cardContent}</Flex>
      <IconButton
        ml="0.5rem"
        size="sm"
        variant="outline"
        aria-label="Delete card"
        icon={<DeleteIcon />}
        float="right"
        onClick={() => {
          handleClick(i);
        }}
      />
    </Flex>
  );
};

export default DeckForm;
