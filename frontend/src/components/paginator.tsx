import { Button, ButtonGroup, Flex } from "@chakra-ui/react";
import React from "react";

type PaginatorProps = {
  pages: number;
  page: number;
  onClick: (p: number) => void;
};

const Paginator: React.FC<PaginatorProps> = ({ pages, page, onClick }) => {
  const generatePages = (pages: number, p: number) => {
    let pagesToShow: number[] = [];

    if (pages <= 1) {
      pagesToShow = [1];
    } else if (pages === 2) {
      pagesToShow = p > 1 ? [p - 1, p] : [p, p + 1];
    } else if (p === 1 && pages > 2) {
      //first page
      pagesToShow = [p, p + 1, p + 2];
    } else if (p !== 1 && p + 1 <= pages) {
      pagesToShow = [p - 1, p, p + 1];
    } else {
      //last page
      pagesToShow = [p - 2, p - 1, p];
    }

    return pagesToShow.map((x) => {
      if (p === x) {
        return (
          <Button key={x} onClick={() => onClick(x)} isDisabled={true}>
            {x}
          </Button>
        );
      }
      return <Button key={x} onClick={() => onClick(x)}>{x}</Button>;
    });
  };


  return pages !== 1 ? (
    <Flex align="center" justify="center">
      <ButtonGroup spacing={4}>{generatePages(pages, page)}</ButtonGroup>
    </Flex>
  ) : null;
};

export default Paginator;