import { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import IBadgesModel from "../model/IBadgesModel";
import IUserModel from "../model/IUserModel";
import ISessionModel from "../model/ISessionModel";
import { getBadges } from "../services/badges-service";
import { updateUser } from "../services/keycloak-service";
import { updateSession } from "../services/session-service";
import {
  Avatar,
  Badge,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const Accueil = () => {
  const [badges, setBadges] = useState<IBadgesModel[]>([]);
  const [user, setUser] = useState<IUserModel>();
  const [open, setOpen] = useState(false);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  let session: ISessionModel = JSON.parse(
    localStorage.getItem("session") || ""
  );

  const handleClose = () => {
    setOpen(false);
  };

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
    setUser(session.user);
  }, []);

  function handleClick(id: string) {
    console.log(id);
    navigate(`/exercices/${id}`);
  }

  function checkBadge(badge: IBadgesModel) {
    if (session.badges.find((badges) => badges._id === badge._id)) {
      return true;
    } else {
      return false;
    }
  }

  function updateUserById(data: any) {
    data.id = session.user.id;
    console.log(data);
    updateUser(session.user.id, data).then((user) => {
      console.log(data);
      localStorage.setItem("user", JSON.stringify(data));
      let localSession: ISessionModel = JSON.parse(
        localStorage.getItem("session") || ""
      );
      localSession.user = data;
      updateSession(session._id, session).then((session) => {
        localStorage.setItem("session", JSON.stringify(localSession));
      });
      setOpen(false);
    });
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid xs={1}></Grid>
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
                onClick={() => setOpen(true)}
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
                {badges.length === 0 ? (
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
                              sx={{ width: 56, height: 56, margin: "auto" }}
                              onClick={() => handleClick(badges[index]._id)}
                            />
                          </Badge>
                        ) : (
                          <Avatar
                            alt={badges[index].name}
                            src={badges[index].image}
                            sx={{ width: 56, height: 56, margin: "auto" }}
                            onClick={() => handleClick(badges[index]._id)}
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
          <form onSubmit={handleSubmit(updateUserById)}>
            <DialogTitle>Modifier mon profil</DialogTitle>
            <DialogContent>
              <TextField
                {...register("username")}
                autoFocus
                margin="dense"
                defaultValue={user?.username}
                id="nom"
                label="Pseudo"
                type="texte"
                fullWidth
                variant="standard"
                color="error"
              />
              <TextField
                {...register("firstName")}
                autoFocus
                margin="dense"
                defaultValue={user?.firstName}
                id="prenom"
                label="Prénom"
                type="texte"
                fullWidth
                variant="standard"
                color="error"
              />
              <TextField
                {...register("lastName")}
                autoFocus
                margin="dense"
                defaultValue={user?.lastName}
                id="nom"
                label="Nom"
                type="texte"
                fullWidth
                variant="standard"
                color="error"
              />
              <TextField
                {...register("email")}
                autoFocus
                margin="dense"
                defaultValue={user?.email}
                id="email"
                label="Email"
                type="texte"
                fullWidth
                variant="standard"
                color="error"
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClose}
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
                Annuler
              </Button>
              <Button
                type="submit"
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
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </>
  );
};

export default Accueil;
