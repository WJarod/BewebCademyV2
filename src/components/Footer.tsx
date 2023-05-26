import React, { FC, ReactElement } from "react";
import { Box, Container, Grid, Link, Typography } from "@mui/material";

const Footer: FC = (): ReactElement => {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#1d1d1b",
        paddingTop: "0.2rem",
        paddingBottom: "0.2rem",
      }}
    >
      <Container maxWidth="lg">
        <Grid container direction="column" alignItems="center">
          <Grid item xs={12}>
            <Typography color="white" variant="h5">
              BewebCademy
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography color="white" variant="subtitle1">
              {`${new Date().getFullYear()}`}
              <Link href="https://fondespierre.com/nos-poles-de-competences/beweb-ecole-numerique/developpeur-web/" underline="hover" color={"white"}>
                {'  | Fondes Pierre'}
              </Link>
              <Link href="https://fr-fr.facebook.com/bewebERN/" underline="hover" color={"white"}>
                {'  | Facebook'}
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
