import React, { useState } from "react";
import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  Paper,
  Transition,
  Title,
  Switch,
  Button,
} from "@mantine/core";
import { useBooleanToggle, useToggle } from "@mantine/hooks";

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 1,
  },

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color:
        theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 3 : 7],
    },
  },
}));

interface HeaderResponsiveProps {
  setPage: React.Dispatch<React.SetStateAction<string>>;
  checkLogin: () => void;
  toggleDeleteMode: (value?: React.SetStateAction<string> | undefined) => void;
  deleteMode: string
  page: string
}

export function HeaderResponsive({
    page,
  setPage,
  checkLogin,
  toggleDeleteMode,
  deleteMode,
}: HeaderResponsiveProps) {
  const [opened, toggleOpened] = useBooleanToggle(false);
  const [active, setActive] = useState("List Furniture");
  const { classes, cx } = useStyles();

  const logout = () => {
    localStorage.removeItem("jwt");
    checkLogin();
  };

  const items = (
    <>
      <a
        key={"List Furniture"}
        href={""}
        className={cx(classes.link, {
          [classes.linkActive]: page === "list",
        })}
        onClick={(event) => {
          event.preventDefault();
          setActive("List Furniture");
          toggleOpened(false);
          setPage("list");
        }}
      >
        List Furniture
      </a>
      <a
        key={"Create New"}
        href={""}
        className={cx(classes.link, {
          [classes.linkActive]: page === "createNew",
        })}
        onClick={(event) => {
          setPage("createNew");
          event.preventDefault();
          setActive("createNew");
          toggleOpened(false);
        }}
      >
        Create New
      </a>

      <a
        key={"Logout"}
        href={""}
        className={cx(classes.link, {
          [classes.linkActive]: page === "Logout",
        })}
        onClick={(event) => {
          event.preventDefault();
          setActive("createNew");
          logout();
        }}
      >
        Logout
      </a>
    </>
  );

  return (
    <Header height={HEADER_HEIGHT} className={classes.root}>
      <Container className={classes.header}>
        <Title>Furniture</Title>
        <Group spacing={5} className={classes.links}>
          {items}
        </Group>
        <Button color={deleteMode === 'view' ? 'blue' : 'red' } onClick={() => toggleDeleteMode()}>
          {deleteMode === 'view' ? 'View Mode' : 'Delete Mode'}
        </Button>

        <Burger
          opened={opened}
          onClick={() => toggleOpened()}
          className={classes.burger}
          size="sm"
        />

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
}
