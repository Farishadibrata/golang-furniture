import { AppShell, Group, Header, Navbar, SimpleGrid, Title } from "@mantine/core";
import { gql, GraphQLClient } from "graphql-request";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { CardWithStats } from "./card.component";
import CreateFurniture from "./createFurniture.component";
import ListFurniture from "./listFurniture.component";

function Furnitures({ checkLogin }: any) {

  const [page, setPage] = useState('list')

  const logout = () => {
    localStorage.removeItem("jwt");
    checkLogin();
  };

  return (
    <AppShell
      padding="md"
      header={
        <Header height={60} p="xs">
          <Group>

            <Title>Furniture</Title>{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setPage('list')
              }}
            >
              List Furniture
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setPage('createNew')
              }}
            >
              Create New
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
            >
              Logout
            </a>

          </Group>

        </Header>
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
      <div>
        {
          page === 'list' ? <ListFurniture /> : <CreateFurniture />
        }

      </div>
    </AppShell>
  );
}

export default Furnitures;
