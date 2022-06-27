import React, { useEffect, useState } from "react";
import {
  createStyles,
  Card,
  Image,
  Text,
  Group,
  RingProgress,
  useMantineTheme,
  Badge,
  ActionIcon,
  LoadingOverlay,
} from "@mantine/core";
import { Clock } from "tabler-icons-react";
import * as CurrencyFormat from "react-currency-format";
import { gql, GraphQLClient } from "graphql-request";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
} from "react-query";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
  },
}));

interface CardWithStatsProps {
  id: string;
  name: string;
  description: string;
  index: number;
  badgeColor: string;
  style: string;
  price: number;
  deliveryDays: number;
  deleteMode: string;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<any, unknown>>;
}

export function CardWithStats({
  deleteMode,
  id,
  name,
  description,
  price,
  deliveryDays,
  index,
  style,
  badgeColor,
  refetch,
}: CardWithStatsProps) {
  const { classes } = useStyles();
  const [imageFetched, setImageFetched] = useState(Date.now())
  const client = new GraphQLClient("/gql/query", {
    headers: {
      authorization: "Bearer " + localStorage.getItem("jwt"),
    },
  });
  
  const { mutate: deleteItemMutation, isLoading } = useMutation(
    async (id: string) => {
      const query = gql`mutation{
            deleteItem(id : "${id}")
          }`;
      return await client.request(query, {
        id,
      });
    },
    {
      onSuccess: () => {
        setImageFetched(Date.now())
        refetch()
      },
    }
  );

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  return (
    <Card
      withBorder
      p="lg"
      className={classes.card}
      onClick={() => {
        console.log(id)
        if (deleteMode === "delete") {
          deleteItemMutation(id);
        }
      }}
    >
      <Card.Section>
        <Image
        key={imageFetched}
          src={"https://source.unsplash.com/random/?furniture " + style + index + "#" + imageFetched}
          alt={name}
          height={300}
        />
      </Card.Section>

      <Group position="apart" mt="xl">
        <Text size="sm" weight={700} className={classes.title}>
          {name} {index}
        </Text>
        <Group>
          <Badge leftSection={"🕰️"}>{deliveryDays} Days</Badge>
        </Group>
        <Badge color={badgeColor}>{style}</Badge>
      </Group>

      <Text mt="sm" mb="md" color="dimmed" size="xs">
        <CurrencyFormat
          value={price}
          displayType={"text"}
          thousandSeparator={"."}
          prefix={"Rp."}
          decimalSeparator={","}
        />
      </Text>
      <Text mt="sm" mb="md" color="dimmed" size="xs">
        {description}
      </Text>
    </Card>
  );
}
