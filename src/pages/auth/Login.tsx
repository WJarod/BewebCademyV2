import { Box, Grid, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { createSession, getSessionByUserId } from "../../services/session-service";
import IUserModel from "../../model/IUserModel";
import { checkDreaftOpen } from "../../services/draft-service";

const Login = () => {

  const [draftOpen, setDraftOpen] = useState(false);

  checkDreaftOpen().then((res) => {
    if (res.status === 201) { setDraftOpen(true); }
    localStorage.setItem("draft", JSON.stringify(res))
    console.log("draftOpen", draftOpen);
  });

  const { keycloak, initialized } = useKeycloak();

  const checkSession = async () => {
    console.log("checkSession");
    if (keycloak.authenticated) {
      let user: IUserModel = {
        id: keycloak.tokenParsed?.sub || "",
        username: keycloak.tokenParsed?.preferred_username || "",
        firstName: keycloak.tokenParsed?.family_name || "",
        lastName: keycloak.tokenParsed?.given_name || "",
        email: keycloak.tokenParsed?.email || ""
      }

      localStorage.setItem("user", JSON.stringify(user))

      const session = await getSessionByUserId(user.id);
      if (session) {
        console.log("Session existante");
        localStorage.setItem("session", JSON.stringify(session));
        if (keycloak.hasRealmRole("formateur")) {
          localStorage.setItem("role", "formateur")
          window.location.href = "/admin";
        } else {
          localStorage.setItem("role", "user")
          window.location.href = "/home";
        }
      } else {
        console.log("Session non existante");
        const newSession = await createSession(user);
        localStorage.setItem("session", JSON.stringify(newSession));
        console.log(newSession);
        if (keycloak.hasRealmRole("formateur")) {
          localStorage.setItem("role", "formateur")
          window.location.href = "/admin";
        } else {
          localStorage.setItem("role", "user")
          window.location.href = "/home";
        }
      }
    }
  }

  const login = () => {
    keycloak.login();
  }

  useEffect(() => {
    if (initialized) {
      checkSession();
      checkDreaftOpen();
    }
  }, [initialized]);


  return (
    <div>
      <Box sx={{ width: '100%', typography: 'body1', minHeight: 'calc(100vh - 38px)', display: 'flex', flexDirection: 'column' }}>
        {!draftOpen ? (
          <Grid container spacing={2} height="100%" sx={{ flexGrow: 1 }}>
            <Grid item xs={12} md={6} display="flex" justifyContent="center" alignItems="center">
              <img src="https://i.ibb.co/7ND1qzz/gcm-Rp-J7-400x400-removebg-preview.png" width="70%" height="auto" />
            </Grid>
            <Grid item xs={12} md={6} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
              <Typography variant="h4" component="h1" align="center" sx={{ my: 4, px: { xs: 2, sm: 4 } }}>
                Une période de préparation pour une draft est en cours. Vous pouvez participer pour avoir une chance d'être sélectionné. Il vous faut juste réaliser les exercices et obtenir des badges.
              </Typography>
              <Button onClick={login} variant="contained" sx={{ bgcolor: '#db1144', '&:hover': { bgcolor: '#1d1d1b' } }}>
                Participez à la draft
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2} height="100%" sx={{ flexGrow: 1 }}>
            <Grid item xs={12} md={6} display="flex" justifyContent="center" alignItems="center">
              <img src="https://i.ibb.co/7ND1qzz/gcm-Rp-J7-400x400-removebg-preview.png" width="70%" height="auto" />
            </Grid>
            <Grid item xs={12} md={6} display="flex" justifyContent="center" alignItems="center">
              <Typography variant="h4" component="h1" align="center" sx={{ my: 4, px: { xs: 2, sm: 4 } }}>
                Il
                n'y a pas de période de draft en cours, revenez plus tard.</Typography>
            </Grid>
          </Grid>
        )}
      </Box>
    </div>
  );
}

export default Login;