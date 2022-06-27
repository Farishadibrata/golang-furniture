import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { gql, GraphQLClient } from "graphql-request";
import React, { useEffect } from "react";
import { useMutation } from "react-query";
import { Pages } from ".";

interface registerCreds {
  email: string;
  name: string;
  password: string;
}

interface RegisterPage extends Pages {
    setAlertSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  }

const RegisterPage = ({ setPage, setAlertSuccess }: RegisterPage) => {
  const client = new GraphQLClient("/gql/query");
  const { mutate: registerMutation} = useMutation(
    async (auth: registerCreds) => {
      const variables = {
        email: auth.email,
        name: auth.name,
        password: auth.password,
      };

      const query = gql`mutation createUser {
          auth {
            register(input: {email : "${auth.email}" name:"${auth.name}" password : "${auth.password}"})
          }
        }`;
      return await client.request(query, variables);
    },
    {
      onSuccess: () => {
        setPage("Login");
        setAlertSuccess(true);
      },
    }
  );

  useEffect(() => {
    setAlertSuccess(false);
  }, []);

  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });
  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Register Here
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        have an account ?{" "}
        <Anchor<"a">
          href="#"
          size="sm"
          onClick={(event) => {
            event.preventDefault();
            setPage("Login");
          }}
        >
          Login
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form
          onSubmit={form.onSubmit((values) => {

            registerMutation({
                email : values.email,
                password: values.password,
                name: values.name
            })
          })}
        >
          <TextInput
            label="Email"
            placeholder="you@mantine.dev"
            required
            {...form.getInputProps("email")}
          />
          <TextInput
            label="Name"
            placeholder="Username Here"
            required
            {...form.getInputProps("name")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            {...form.getInputProps("password")}
          />

          <Button fullWidth mt="xl" type="submit">
            Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
};
export {RegisterPage};
