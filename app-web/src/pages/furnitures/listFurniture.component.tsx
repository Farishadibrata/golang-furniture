import {
    Center,
  Grid,
  LoadingOverlay,
  SimpleGrid,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { gql, GraphQLClient } from "graphql-request";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { CardWithStats } from "./card.component";

interface item {
  id: string;
  name: string;
  price: number;
  style: string;
  description: string;
  deliveryDays: number;
}

interface ListFurniture {
    deleteMode : string
}
function ListFurniture({deleteMode} : ListFurniture) {
  const [styles, setStyles] = useState([]);

  const COLOR_LIST = Object.keys(useMantineTheme().colors);
  const [badgeColors, setBadgeColors] = useSetState<any>({});

  const client = new GraphQLClient("/gql/query", {
    headers: {
      authorization: "Bearer " + localStorage.getItem("jwt"),
    },
  });

  const { isLoading, data, refetch } = useQuery(
    ["cardFurnitures", styles],
    async () => {
      const queryFilter = "";
      const query = gql`
        query items {
          items(input: {}) {
            id
            name
            price
            style
            description
            deliveryDays
          }
        }
      `;
      return await client.request(query).then((data) => data.items);
    },
    {
      initialData: [],
    }
  );


  useEffect(() => {
    data.map((item: any) => {
      if (!Object.keys(badgeColors).includes(item.style)) {
        let colors = COLOR_LIST.sort(() => 0.5 - Math.random());
        colors.map((color: string) => {
          if (!Object.values(badgeColors).includes(color)) {
            setBadgeColors({ [item.style]: color });
          }
        });
      }
    });
  }, [data, badgeColors]);

  if (isLoading || (data.length !== 0 && Object.keys(badgeColors).length === 0)) {
    return <LoadingOverlay visible />;
  }

  return (
    <>
        {data.length === 0 && <Center mb='sm'> No Data</Center>}

      <Grid columns={4}>
        {data.map((i : item, index: number) => (
          <Grid.Col md={1} sm={2} span={4}>
            <CardWithStats
              {...i}
              index={index}
              deliveryDays={i.deliveryDays}
              badgeColor={badgeColors[i.style]}
              deleteMode={deleteMode}
              refetch={refetch}
            />
          </Grid.Col>
        ))}
      </Grid>
    </>
  );
}

export default ListFurniture;
