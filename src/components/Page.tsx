//return a component with a appbar and a footer and a page
import React from "react";
import AppBarre from "./AppBarre";
import Footer from "./Footer";
import Login from "../pages/auth/Login";
import Stack from "@mui/material/Stack";

const Page = ({ children }: any) => {
  children === undefined ? (children = <Login />) : (children = children);

  return (
    <Stack
  direction="column"
  justifyContent="space-between"
  alignItems="stretch"
  spacing={18}
>
      <AppBarre />
      {children}
      <Footer />
    </Stack>
  );
};

export default Page;
