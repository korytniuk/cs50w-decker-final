import {
  VStack,
  HStack,
  Text,
  Center,
  Divider,
  Flex,
  Spacer,
  IconButton,
  Box,
  ScaleFade,
  useClipboard,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import React, { Component, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { playDeck, getPlayDeck } from "../api/rest";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { DeckProps } from "./table";
import { DisplayBox } from "./detail";
import { handleError } from "./errorHandler";

interface RouterParams {
  id: string;
}

interface IState {
  deck?: DeckProps | null;
  finished: boolean;
  played: boolean;
  chosenCards: string[];
  id: string;
}

class Play extends Component<RouteComponentProps<RouterParams>, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      deck: null,
      finished: false,
      played: false,
      chosenCards: [],
      id: props.match.params.id,
    };
  }

  componentDidMount() {
    getPlayDeck(this.state.id).then(
      (res) => {
        if (res.finished) {
          this.setState({ finished: true, chosenCards: res.result });
        } else if (res.played) {
          this.setState({ played: true });
        } else {
          this.setState({ deck: res.deck });
        }
      },
      (error) => {
        //todo handle
        console.log(error.request.status);
      }
    );
  }

  handlePlay(cards: any[]) {
    this.setState({ played: true });
    //submit to the server
    playDeck(
      this.state.id,
      cards.filter((x) => x.chosen).map((x) => x.content)
    ).then(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  render() {
    const { deck, finished, chosenCards, played } = this.state;

    if (finished) {
      return (
        <Box pt={5}>
          <DisplayBox cards={chosenCards} offset={1} />
        </Box>
      );
    } else if (played) {
      return <Panel />;
    }

    return (
      deck && (
        <CardChooser
          deck={deck}
          onHandlePlay={(cards: any[]) => this.handlePlay(cards)}
        />
      )
    );
  }
}

function shuffle(arr: string[]): string[] {
  const shuffled = [];
  while (arr.length) {
    const index = Math.random() * arr.length;
    shuffled.push(arr.splice(index, 1)[0]);
  }

  return shuffled;
}

const Panel: React.FC<any> = ({}) => {
  const [value, setValue] = React.useState(window.location.href);
  const { hasCopied, onCopy } = useClipboard(value);

  return (
    <Center minH="80vh">
      <VStack direction="column" shadow="md" borderWidth="1px" gap={5} p={5}>
        <Text fontSize="40px" color="red.200" textAlign="center">
          You've finished the deck!
        </Text>
        <Text fontSize="lg" textAlign="center">
          Share it with your friends to play to see the results.
        </Text>
        <Flex mt={2}>
          <Input
            value={value}
            isReadOnly
            isTruncated
            placeholder="url to share"
          />
          <Button onClick={onCopy} ml={2}>
            {hasCopied ? "Copied" : "Copy"}
          </Button>
        </Flex>
      </VStack>
    </Center>
  );
};

const CardChooser: React.FC<any> = ({ deck, onHandlePlay }) => {
  const [cards, setCards] = useState(
    shuffle(deck.cards.slice()).map((_) => {
      return { content: _, chosen: true };
    })
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [show, setShow] = useState(true);
  const toast = useToast();

  const handleDismiss = () => {
    setShow(false);
    cards[currentIndex].chosen = false;
    setCards(cards.slice());
  };

  const handlePlay = () => {
    if (cards.filter((x) => x.chosen).length === 0) {
      handleError(toast, "You must chose at least one card to proceed further");
      setCurrentIndex(0);
      setShow(true);
    } else {
      onHandlePlay(cards);
    }
  };

  useEffect(() => {
    if (show) return;

    if (currentIndex + 1 >= cards.length) {
      handlePlay();
      return;
    }

    setTimeout(() => {
      setShow(true);
      setCurrentIndex(currentIndex + 1);
    }, 200);
  }, [show]);

  const handleAccept = () => {
    setShow(false);
    cards[currentIndex].chosen = true;
    setCards(cards.slice());
  };

  return (
    <VStack h="85vh" justifyContent="space-evenly">
      <Center
        h="80%"
        w={["100%", "80%"]}
        rounded="md"
        shadow="md"
        borderWidth="1px"
      >
        <ScaleFade initialScale={0.01} in={show}>
          <Text fontSize="3xl" color="grey">{cards[currentIndex].content}</Text>
        </ScaleFade>
      </Center>
      <HStack justify="space-between" w="40%">
        <IconButton
          aria-label="dismiss card"
          icon={<CloseIcon boxSize={8} color="red.500" />}
          colorScheme="transparent"
          onClick={handleDismiss}
        />
        <Divider orientation="vertical" />
        <IconButton
          aria-label="accept card"
          colorScheme="transparent"
          onClick={handleAccept}
          icon={<CheckIcon boxSize={8} color="blue.500" />}
        />
      </HStack>
    </VStack>
  );
};

export default Play;
