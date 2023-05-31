import Box from "@mui/material/Box";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import LogoutIcon from '@mui/icons-material/Logout';
import { useKeycloak } from "@react-keycloak/web";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";


const AppBarre = () => {
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();
  
  const logout = () => {
    localStorage.clear()
    keycloak.logout().then(() => {
      keycloak.clearToken()
      })
      navigate(`/`);

  }

  return (
    <>
      <AppBar position="static" sx={
        {
          backgroundColor: "#1d1d1b",
          boxShadow: "none",
          borderBottom: "1px solid #e0e0e0",
          color: "white",
        }
      }>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <img src="https://i.ibb.co/8xbVbP5/logo-bewebcademy-whitetext-1.png" alt="logo" width="300vh"/>
            <Box
              sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
            ></Box>

            <Box sx={{ flexGrow: 0 }}>
              <Button
                onClick={logout}
                sx={{
                  color: "white",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
              >
                <LogoutIcon sx={{ color: "white" }} />
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};
export default AppBarre;
