import React from 'react';
import { createStyles, Card, Image, Text, Group, RingProgress } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
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
}

export function CardWithStats({ name, description, index }: CardWithStatsProps) {
  const { classes } = useStyles();


  return (
    <Card withBorder p="lg" className={classes.card}>
      <Card.Section>
        <Image src={"https://source.unsplash.com/random/?furniture#" + index} alt={name} height={100} />
      </Card.Section>

      <Group position="apart" mt="xl">
        <Text size="sm" weight={700} className={classes.title}>
          {name}
        </Text>

      </Group>
      <Text mt="sm" mb="md" color="dimmed" size="xs">
        {description}
      </Text>
    </Card>
  );
}