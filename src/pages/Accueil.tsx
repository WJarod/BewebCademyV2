import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const Accueil = () => {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#1d1d1b",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: "white",
  }));

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
      <Grid xs={1}>
        </Grid>
        <Grid xs={3}>
          <Item sx={{ height: "55vh" }}>BADGES</Item>
        </Grid>
        <Grid xs={4}>
          <Item sx={{ height: "55vh" }}>PROFIL</Item>
        </Grid>
        <Grid xs={3}>
          <Item sx={{ height: "55vh" }}>COURS</Item>
        </Grid>
        <Grid xs={1}>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Accueil;
