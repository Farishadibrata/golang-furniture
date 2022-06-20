import React, { useState } from 'react';
import { createStyles, Card, Image, Text, Group, RingProgress, useMantineTheme, Badge, ActionIcon } from '@mantine/core';
import { Clock } from 'tabler-icons-react';
import * as CurrencyFormat from 'react-currency-format'

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
    borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
      }`,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
  },
}));

interface CardWithStatsProps {
  name: string;
  description: string;
  index: number
  badgeColor: string
  style: string
  price: string
  deliveryDays: string
}

export function CardWithStats({ name, description, price, deliveryDays, index, style, badgeColor }: CardWithStatsProps) {
  const { classes } = useStyles();
  console.log(deliveryDays)
  return (
    <Card withBorder p="lg" className={classes.card}>
      <Card.Section>
        <Image src={"https://source.unsplash.com/random/?furniture#" + index} alt={name} height={300} />
      </Card.Section>

      <Group position="apart" mt="xl">
        <Text size="sm" weight={700} className={classes.title}>
          {name}
        </Text>
        <Group>
          <Badge
            leftSection={"🕰️"}
          >
            {deliveryDays} Days
          </Badge>
        </Group>
        <Badge color={badgeColor}>{style}</Badge>
      </Group>

      <Text mt="sm" mb="md" color="dimmed" size="xs">
      <CurrencyFormat value={price} displayType={'text'} thousandSeparator={true} prefix={'Rp.'} />
      </Text>
      <Text mt="sm" mb="md" color="dimmed" size="xs">
        {description}
      </Text>
    </Card>
  );
}