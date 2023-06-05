import { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import IBadgesModel from "../model/IBadgesModel";
import IUserModel from "../model/IUserModel";
import ISessionModel from "../model/ISessionModel";
import IExerciceModel from "../model/IExerciceModel";
import { getBadges } from "../services/badges-service";
import { getUsers } from "../services/keycloak-service";
import { getSessionByUserId } from "../services/session-service";
import {
  Avatar,
  Badge,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { set } from "react-hook-form";

const User = () => {
  const [badges, setBadges] = useState<IBadgesModel[]>([]);
  const [user, setUser] = useState<IUserModel>();
  const [session, setSession] = useState<ISessionModel>();
  const [exercices, setExercices] = useState<IExerciceModel[]>([]);
  const [exercicesBadge, setExercicesBadge] = useState<IExerciceModel[]>([]);
  const [open, setOpen] = useState(false);
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
    const url = window.location.href;
    const id = url.substring(url.lastIndexOf("/") + 1);
    getSessionByUserId(id).then((session) => {
      setSession(session);
      setUser(session.user);
      setExercices(session.exercices);
    });
  }, []);

  const handleClose = () => {
    setOpen(false);
    setExercicesBadge([]);
  };

  const handleOpen = (id: string) => {
    exercices.map((exercice) => {
      if (exercice.badges._id === id) {
        exercicesBadge.push(exercice);
      }
    });
    setOpen(true);
  };

  function checkBadge(badge: IBadgesModel) {
    if (session!.badges === undefined) {
        return false;
    }

    if (session!.badges.find((badges) => badges._id === badge._id)) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid xs={1}></Grid>
          <Grid xs={4}>
            <Item sx={{ height: "55vh" }}>
              {/* ligne avec le bouton et le titre */}
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid xs={1}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#db1144",
                        color: "#ffffff",
                        "&:hover": {
                          backgroundColor: "#ffffff",
                          color: "#db1144",
                        },
                      }}
                      onClick={() => navigate("/admin")}
                    >
                      <ArrowBackIcon />
                    </Button>
                  </Grid>
                  <Grid xs={11} sx={{ marginLeft: "-2.5vh" }}>
                    <h1>Profil</h1>
                  </Grid>
                </Grid>
              </Box>
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
          <Grid xs={6}>
            <Item sx={{ height: "55vh" }}>
              <h1>Badges</h1>
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
              >
                { badges === undefined || badges.length === 0 || session === undefined ? (
                  <CircularProgress sx={{ margin: "auto" }} />
                ) : (
                  badges.map((_, index) => (
                    <Grid xs={2} sm={4} md={4} key={index}>
                      <>
                        {checkBadge(badges[index]) ? (
                          <Badge
                            color="success"
                            badgeContent={"Fini"}
                            overlap="circular"
                          >
                            <Avatar
                              alt={badges[index].name}
                              src={badges[index].image}
                              sx={{ width: 56, height: 56, margin: "auto"}}
                              onClick={() => handleOpen(badges[index]._id)}
                            />
                          </Badge>
                        ) : (
                          <Avatar
                            alt={badges[index].name}
                            src={badges[index].image}
                            sx={{ width: 56, height: 56, margin: "auto" }}
                            onClick={() => handleOpen(badges[index]._id)}
                          />
                        )}
                        <p>{badges[index].name}</p>
                      </>
                    </Grid>
                  ))
                )}
              </Grid>
            </Item>
          </Grid>
          <Grid xs={1}></Grid>
        </Grid>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Exercices finis</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {exercicesBadge.map((exercice) => (
                <p>{exercice.name}</p>
              ))}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleClose()}
              variant="contained"
              sx={{
                backgroundColor: "#db1144",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#ffffff",
                  color: "#db1144",
                },
              }}
            >
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default User;
