import {
  Flex,
  Heading,
  Text,
  IconButton,
  Grid,
  GridItem,
  Stack,
  Button,
} from "@chakra-ui/react";
import React, { Component, useEffect, useState } from "react";
import { createPlayDeck, getDeck } from "../api/rest";
import { RouteComponentProps, withRouter } from "react-router";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";

interface RouterParams {
  id: string;
}

interface IProps extends RouteComponentProps<RouterParams> {}

class DeckDetail extends Component<IProps> {
  constructor(props: any) {
    super(props);
    this.state = {
      deck: null,
    };
  }

  componentDidMount() {
    let { id } = this.props.match.params;
    const { history } = this.props;

    getDeck(id)
      .then((res) => {
        this.setState({ deck: res });
      })
      .catch((error) => {
        history.push(`/decks/`);
      });
  }

  handlePlayClick() {
    let { id } = this.props.match.params;
    const { history } = this.props;

    createPlayDeck(id)
      .then((res) => {
        history.push(`/play/${res.id}/`);
      })
      .catch((error) =>{});
  }

  render() {
    const { deck }: any = this.state;

    return (
      deck && (
        <Flex direction="column">
          <Stack gap={4} mt={1}>
            <Flex justifyContent="space-evenly">
              <Heading textAlign="center">{deck.title}</Heading>
              <Button onClick={() => this.handlePlayClick()}>Play</Button>
            </Flex>
            <DisplayBox cards={deck.cards} />
          </Stack>
        </Flex>
      )
    );
  }
}

const DisplayBox: React.FC<{ cards: string[]; offset?: number }> = ({
  cards,
  offset = 4,
}) => {
  const [visibleCards, setVisibleCards] = useState(cards.slice(0, offset));
  const [indices, setIndices] = useState({ start: 0, end: offset });

  const handleBackClick = () => {
    setIndices({ start: indices.start - offset, end: indices.end - offset });
  };

  const handleForwardClick = () => {
    setIndices({ start: indices.start + offset, end: indices.end + offset });
  };

  useEffect(() => {
    setVisibleCards(cards.slice(indices.start, indices.end));
  }, [indices]);

  return (
    <Flex alignItems="center" justifyContent="space-between" direction="row">
      <IconButton
        onClick={handleBackClick}
        isDisabled={indices.start === 0}
        aria-label="show the previous four cards"
        icon={<ArrowBackIcon />}
      />
      <Grid
        h="calc(100vh - 180px)"
        flexGrow={0.95}
        templateColumns={
          offset === 1 ? "repeat(1, 1fr)" : ["repeat(1, 1fr)", "repeat(2, 1fr)"]
        }
        templateRows={
          offset === 1 ? "repeat(1, 1fr)" : ["repeat(4, 1fr)", "repeat(2, 1fr)"]
        }
        gap={6}
      >
        {visibleCards.map((x) => (
          <GridItem
            key={x}
            bg={offset === 1 ? "yellow.100" : "white"}
            shadow="md"
            borderWidth="1px"
          >
            <Flex alignItems="center" justifyContent="center" h="100%">
              <Text fontSize="2xl" textAlign="center" p={5} color="grey">
                {x}
              </Text>
            </Flex>
          </GridItem>
        ))}
      </Grid>
      <IconButton
        onClick={handleForwardClick}
        isDisabled={indices.end >= cards.length}
        aria-label="show the next four cards"
        icon={<ArrowForwardIcon />}
      />
    </Flex>
  );
};

export default withRouter(DeckDetail);
export { DisplayBox };
