import {
  Alert,
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
import React, { useState } from "react";
import { useMutation } from "react-query";
import { AlertCircle } from "tabler-icons-react";
import { Pages } from ".";

interface loginCreds {
  email: string;
  password: string;
}
interface LoginPage extends Pages {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  checkLogin: () => void;
}

const LoginPage = ({ setPage, setIsLoggedIn, checkLogin }: LoginPage) => {
  const client = new GraphQLClient("/gql/query");
  const [invalidLoginAlert, setInvalidLoginAlert] = useState(false);
  const { mutate: loginMutation } = useMutation(
    async (auth: loginCreds) => {
      const variables = {
        email: auth.email,
        password: auth.password,
      };

      const query = gql`mutation login {
          auth {
            login(input: {email : "${auth.email}" password : "${auth.password}"})
          }
        }`;
      return await client.request(query, variables);
    },
    {
      onError: () => {
        setInvalidLoginAlert(true)
      },
      onSuccess: (data) => {
        localStorage.setItem("jwt", data.auth.login.token);
        checkLogin();
      },
    }
  );

  const form = useForm({
    initialValues: {
      email: "",
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
        Welcome to Furniture Gallery!
      </Title>
      
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor<"a">
          href="#"
          size="sm"
          onClick={(event) => {
            event.preventDefault();
            setPage("Register");
          }}
        >
          Create account
        </Anchor>
      </Text>

      {invalidLoginAlert && (
        <Alert mt='sm' icon={<AlertCircle size={16} />} title="Error!" color="red">
          Invalid Login, Please check username and email are match.
        </Alert>
      )}
      
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form
          onSubmit={form.onSubmit((values) => {
            setPage("Login");
            loginMutation({
              email: values.email,
              password: values.password,
            });
          })}
        >
          <TextInput
            label="Email"
            placeholder="you@mantine.dev"
            required
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps("password")}
          />

          <Button fullWidth mt="xl" type="submit">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
};
export {LoginPage};
