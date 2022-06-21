import {
  AppShell,
  Group,
  Header,
  Navbar,
  SimpleGrid,
  Title,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { gql, GraphQLClient } from "graphql-request";
import { useState } from "react";
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useMutation, useQuery } from "react-query";
import { CardWithStats } from "./card.component";
import CreateFurniture from "./createFurniture.component";
import { HeaderResponsive } from "./header.component";
import ListFurniture from "./listFurniture.component";

interface FurniturePage {
  checkLogin: () => void;
}

function Furnitures({ checkLogin }: FurniturePage) {
  const [page, setPage] = useState("list");
  const [deleteMode, toggleDeleteMode] = useToggle('view', ['view', 'delete']);

  return (
    <AppShell
      padding="md"
      header={
        <HeaderResponsive
          setPage={setPage}
          checkLogin={checkLogin}
          deleteMode={deleteMode}
          toggleDeleteMode={toggleDeleteMode}
          page={page}
        />
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <div>{page === "list" ? <ListFurniture deleteMode={deleteMode} /> : <CreateFurniture setPage={setPage} />}</div>
    </AppShell>
  );
}

export default Furnitures;
