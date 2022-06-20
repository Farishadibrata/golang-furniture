import { AppShell, Group, Header, Navbar, SimpleGrid, Title } from "@mantine/core";
import { gql, GraphQLClient } from "graphql-request";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import {CardWithStats} from "./card.component";

function Furnitures({ checkLogin }: any) {
  const logout = () => {
    localStorage.removeItem("jwt");
    checkLogin();
  };

  const client = new GraphQLClient("/gql/query", {
    headers: {
      authorization : "Bearer " + localStorage.getItem('jwt')
    }
  })

  const [styles, setStyles] = useState([])

  const { isLoading, error, data } = useQuery(['cardFurnitures', styles],async () =>{
    const queryFilter =''
    const query = gql`query items {
      items(input: {}){
        id
        name
        price
        style
        description
      }
    }`;
    return await client.request(query).then(data => data.items)
  }, {
    initialData: []
  })
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
        <>

        <SimpleGrid cols={4}>

        {data.map((i, index) => (
          <CardWithStats {...i} index={index}/>
          ))}
          </SimpleGrid>
        </>

      </div>
    </AppShell>
  );
}

export default Furnitures;
