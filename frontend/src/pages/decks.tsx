import { Box, Button, Divider, Flex } from "@chakra-ui/react";
import React, { Component, useEffect, useRef, useState } from "react";
import { Search, Table, Row, SkeletTable, useDebounce, MoreButton } from "../components/table";
import { getDecks } from "../api/rest";

const Decks: React.FC = () => {
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
    getDecks(1, newTerm).then((result) => {
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
    getDecks().then((result) => {
      setSearchList(result);
    });
  }, []);

  const handleMoreClick = () => {
    getDecks(next!, lastCommittedTerm).then((result) => {
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
      <Table list={list} row={Row}/>
      <MoreButton next={next} onClick={handleMoreClick} />
    </Box>
  );
};



export default Decks;
