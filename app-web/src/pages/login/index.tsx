import React, { useEffect, useState } from "react";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Alert,
} from "@mantine/core";
import { AlertCircle } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { useMutation, useQuery } from "react-query";
import request, { gql, GraphQLClient } from "graphql-request";
import RegisterPage from "./register.component";
import LoginPage from "./login.component";

export interface Pages {
  setPage: React.Dispatch<React.SetStateAction<string>>;
}



interface LoginPageMain {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  checkLogin : () => void
}

export function Login({ setIsLoggedIn, checkLogin }: LoginPageMain) {
  const [page, setPage] = useState("Login");
  const [alertSuccess, setAlertSuccess] = useState(false);

  return (
    <>
      {alertSuccess && (
        <Alert icon={<AlertCircle size={16} />} title="Success!" color="teal">
          Account Has been created, please login to continue
        </Alert>
      )}

      {page === "Register" ? (
        <RegisterPage setAlertSuccess={setAlertSuccess} setPage={setPage} />
      ) : (
        <LoginPage setPage={setPage} setIsLoggedIn={setIsLoggedIn} checkLogin={checkLogin} />
      )}
    </>
  );
}
