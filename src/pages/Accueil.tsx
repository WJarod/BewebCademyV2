import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import IBadgesModel from "../model/IBadgesModel";
import IUserModel from "../model/IUserModel";
import { getBadges } from "../services/badges-service";
import { getUser, getUsers } from "../services/keycloak-service";
import { Avatar, Badge, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const Accueil = () => {
  const [badges, setBadges] = useState<IBadgesModel[]>([]);
  const [user, setUser] = useState<IUserModel>();
  const navigate = useNavigate();

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#1d1d1b",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: "white",
  }));

  useEffect(() => {
    getBadges().then((badges) => {
      setBadges(badges);
    });
    getUsers().then((users) => {
      setUser(users[1]);
    });
  }, []);

  function handleClick(id: string) {
    console.log(id);
    navigate(`/exercices/${id}`);
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid xs={1}></Grid>
          <Grid xs={3}>
            <Item sx={{ height: "55vh" }}>
              <h1>Badges</h1>
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
              >
                {badges.map((_, index) => (
                  <Grid xs={2} sm={4} md={4} key={index}>
                    <>
                      <Badge
                        color="success"
                        badgeContent={"Fini"}
                        overlap="circular"
                      >
                        <Avatar
                          alt={badges[index].name}
                          src={badges[index].image}
                          sx={{ width: 56, height: 56, margin: "auto" }}
                          onClick={() => handleClick(badges[index]._id)}
                        />
                      </Badge>
                      <p>{badges[index].name}</p>
                    </>
                  </Grid>
                ))}
              </Grid>
            </Item>
          </Grid>
          <Grid xs={4}>
            <Item sx={{ height: "55vh" }}>
              <h1>Profil</h1>
              <Avatar
                alt={user?.username}
                sx={{ width: 80, height: 80, margin: "auto", marginTop: "6vh" }}
              >
                {user?.firstName?.charAt(0).toUpperCase()}{" "}
                {user?.lastName?.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ marginTop: "6vh" }}>
                <p>Pseudo : {user?.username}</p>
                <p>Prenom : {user?.firstName}</p>
                <p>Nom : {user?.lastName}</p>
                <p>Mail : {user?.email}</p>
              </Box>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#db1144",
                  color: "#ffffff",
                  marginTop: "6vh",
                  "&:hover": {
                    backgroundColor: "#ffffff",
                    color: "#db1144",
                  },
                }}
              >
                Modifier
              </Button>
            </Item>
          </Grid>
          <Grid xs={3}>
            <Item sx={{ height: "55vh" }}></Item>
          </Grid>
          <Grid xs={1}></Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Accueil;
