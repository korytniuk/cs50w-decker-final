import {
  Text,
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  Table,
  Search,
  useDebounce,
  SkeletTable,
  MoreButton,
  DeckProps,
} from "./table";
import { getPlayDecks } from "../api/rest";
import { Link } from "react-router-dom";

const Plays: React.FC = () => {
  const [term, setTerm] = useState("");
  const [lastCommittedTerm, setLastCommittedTerm] = useState(term);
  const debouncedTerm = useDebounce(term, 300);
  const [list, setList] = useState<any[] | any>(null);
  const [next, setNext] = useState(null);

  useEffect(() => {
    if (debouncedTerm !== lastCommittedTerm) {
      setLastCommittedTerm(debouncedTerm);
      onTermChange(debouncedTerm);
    }
  }, [debouncedTerm, lastCommittedTerm]);

  const onTermChange = (newTerm: string) => {
    getPlayDecks(1, newTerm).then((result) => {
      console.log(result);
      setSearchList(result);
    });
  };

  const setSearchList = (result: any) => {
    const { page, results, next_page } = result;
    const oldResults = page !== 1 ? list : [];
    const updatedResults = [...oldResults, ...results];
    setList(updatedResults);
    setNext(next_page);
  };

  //similar to componentDidMount
  useEffect(() => {
    getPlayDecks().then((result) => {
      console.log(result);
      setSearchList(result);
    });
  }, []);

  const handleMoreClick = () => {
    getPlayDecks(next!, lastCommittedTerm).then((result) => {
      setSearchList(result);
    });
  };

  return list === null ? (
    <SkeletTable />
  ) : (
    <Box mt={3}>
      <Search
        value={term}
        onChange={(e: any) => {
          setTerm(e.target.value);
        }}
      />
      <Divider />
      <Table list={list} row={Row} />
      <MoreButton next={next} onClick={handleMoreClick} />
    </Box>
  );
};

interface PlayDeckProps {
  deck: DeckProps;
  id: number;
  is_played: boolean;
  plays: number;
}

const Row: React.FC<{ deck: PlayDeckProps }> = ({ deck }) => (
  <Flex
    p={3}
    color="grey"
    shadow="md"
    borderWidth="1px"
    direction="row"
    justify="space-between"
    align="center"
    mb={1}
  >
    <Box flex="1">
      <Text>{deck.deck.title}</Text>
    </Box>
    <Flex direction="row" align="center" flex="0.5">
      <Box>
        {deck.plays ? (
        <Text>Games left: {deck.plays}</Text>
        ) : (
          null
        ) }
      </Box>
      <Spacer />
      <Box>
        <ButtonGroup>
          <Link to={`/play/${deck.id}`}>
            <Button bg={deck.is_played ? "grey.50" : "red.100"}>
              {deck.is_played ? "View" : "Play"}{" "}
            </Button>
          </Link>
        </ButtonGroup>
      </Box>
    </Flex>
  </Flex>
);

export default Plays;
