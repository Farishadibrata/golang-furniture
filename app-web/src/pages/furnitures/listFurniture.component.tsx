import {
  Center,
  Grid,
  LoadingOverlay,
  MultiSelect,
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
  deleteMode: string;
  checkLogin: () => void;
}

const queryfy = (obj : any) => {

  // Make sure we don't alter integers.
  if( typeof obj === 'number' ) {
    return obj;
  }

  // Stringify everything other than objects.
  if( typeof obj !== 'object' || Array.isArray( obj ) ) {
    return JSON.stringify( obj );
  }

  // Iterate through object keys to convert into a string
  // to be interpolated into the query.
  let props : any = Object.keys( obj ).map( key =>
    `${key}:${queryfy( obj[key] )}`
  ).join( ',' );

  return `{${props}}`;

}

function ListFurniture({ deleteMode, checkLogin }: ListFurniture) {
  const [styles, setStyles] = useState([]);
  const [deliveryDays, setDeliveryDays] = useState([]);

  const COLOR_LIST = Object.keys(useMantineTheme().colors);
  const [badgeColors, setBadgeColors] = useSetState<any>({});

  const client = new GraphQLClient("/gql/query", {
    headers: {
      authorization: "Bearer " + localStorage.getItem("jwt"),
    },
  });

  const { isLoading, data, error, refetch } = useQuery(
    ["cardFurnitures", styles],
    async () => {
      let queryFilter : any = {};

      if (styles.length !== 0) {
        queryFilter.style = styles;
      }
      if (deliveryDays.length !== 0) {
        queryFilter.deliveryDays = deliveryDays;
      }
      console.log(queryfy(queryFilter))
      const query = gql`
        query items {
          items(input: ${queryfy(queryFilter)}) {
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

  const { isLoading: LoadingDelivery, data: DeliveryDays } = useQuery(
    ["deliveryDays"],
    async () => {
      const query = gql`
        query deliveryDays {
          deliveryDays
        }
      `;
      let DeliveryDays = await client
        .request(query)
        .then((data) => data.deliveryDays);
      let items = [];
      for (let item of DeliveryDays) {
        items.push({
          label: item + " Days",
          value: item,
        });
      }
      return items;
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
    if (error) {
      // @ts-ignore
      if (error.response.status === 403) {
        localStorage.removeItem("jwt");
        checkLogin();
      }
    }
    console.log(JSON.stringify(error));
  }, [data, badgeColors]);

  if (
    LoadingDelivery ||
    isLoading ||
    (data.length !== 0 && Object.keys(badgeColors).length === 0)
  ) {
    return <LoadingOverlay visible />;
  }

  return (
    <>
      <SimpleGrid cols={2} mb="sm">
        <MultiSelect
          data={[
            { value: "Conteporary", label: "Conteporary" },
            { value: "Modern", label: "Modern" },
            { value: "Scandinavian", label: "Scandinavian" },
            { value: "Classic", label: "Classic" },
            { value: "Midcentury", label: "Midcentury" },
          ]}
          onChange={(value) => {
            // @ts-ignore
            setStyles(value);
          }}
          label="Style"
          placeholder="Pick all that you like"
        />
        <MultiSelect
          // @ts-ignore */
          data={DeliveryDays}
          onChange={(value) => {
            // @ts-ignore
            setDeliveryDays(value);
          }}
          label="Delivery Days"
          placeholder="Pick all that you like"
        />
      </SimpleGrid>
      <Grid columns={4}>
        {data.map((i: item, index: number) => (
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
      {data.length === 0 && <Center mb="sm" mt='md'> No Data</Center>}

    </>
  );
}

export default ListFurniture;
