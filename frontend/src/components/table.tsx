import {
  Flex,
  Input,
  Text,
  Stack,
  Tag,
  Box,
  Divider,
  Skeleton,
  ButtonGroup,
  Button,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export interface DeckProps {
  id: number;
  title: string;
  tags: string[];
  views: number;
  cards: string[];
}

type TableProps = {
  list: DeckProps[];
  row: React.FC<any>
};

const Table: React.FC<TableProps> = ({ list, row: Component }) => {

  return (
    <Box>
      {list.map((item) => (
        <Component key={item.id.toString()} deck={item} />
      ))}
    </Box>
  );
};

const Row: React.FC<{ deck: DeckProps }> = ({ deck }) => (
  <Flex
    p={3}
    color="grey"
    shadow="md"
    borderWidth="1px"
    direction="row"
    align="center"
    mb={1}
  >
    <Box flex={0.5}>
      <Text>{deck.title}</Text>
    </Box>
    <Stack direction="row" flex={0.5}>
      {deck.tags.map((n, i) => (
        <Tag key={i}>{n}</Tag>
      ))}
    </Stack>
    <Flex direction="row" align="center" ml={1}>
      <Text>
        {deck.views}
      </Text>
      <ViewIcon ml={1} mr={2}/>
      <Link to={`/decks/${deck.id}`}>
        <Button>View</Button>  
      </Link>
    </Flex>
  </Flex>
);

const MoreButton: React.FC<{ next: number | null; onClick: () => void }> = ({
  next,
  onClick,
}) => (
  <Flex hidden={!next} justify="center" mt={3}>
    <Button color="red.200" onClick={onClick}>
      More
    </Button>
  </Flex>
);

type SearchProps = {
  onChange: (event: ChangeEvent) => void;
  value: string;
};

const Search: React.FC<SearchProps> = ({ value, onChange }) => {
  return (
    <Input
      placeholder="Search for decks"
      variant="flushed"
      value={value}
      onChange={onChange}
    />
  );
};

const SkeletTable: React.FC = () => (
  <Box mt={3}>
    <Skeleton>
      <Input />
    </Skeleton>
    <Divider />
    <Stack>
      {Array(10)
        .fill(0)
        .map((x, i) => (
          <Skeleton key={i.toString()} p={3} height="20px" />
        ))}
    </Stack>
  </Box>
);

function useDebounce(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const firstDebounce = useRef(true);

  useEffect(() => {
    if (value && firstDebounce.current) {
      setDebouncedValue(value);
      firstDebounce.current = false;
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
export { SkeletTable, Search, Table, Row, MoreButton, useDebounce };
