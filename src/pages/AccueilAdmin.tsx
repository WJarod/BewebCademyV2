import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import IBadgesModel from "../model/IBadgesModel";
import IUserModel from "../model/IUserModel";
import ISessionModel from "../model/ISessionModel";
import ILanguageModel from "../model/ILanguageModel";
import IExerciceModel from "../model/IExerciceModel";
import { getBadges, createBadge, deleteBadge } from "../services/badges-service";
import { getSessions } from "../services/session-service";
import { getLanguages } from "../services/language-service";
import { getExerciceByBadgeId, deleteExerciceById } from "../services/exercice-service";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  AlertColor,
  Avatar,
  Badge,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { set, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const AccueilAdmin = () => {
  const [badges, setBadges] = useState<IBadgesModel[]>([]);
  const [user, setUser] = useState<IUserModel>();
  const [sessions, setSessions] = useState<ISessionModel[]>([]);
  const [languages, setLanguages] = useState<ILanguageModel[]>([]);
  const [selectLanguage, setSelectLanguage] = useState<ILanguageModel[]>([]);
  const [exercices, setExercices] = useState<IExerciceModel[]>([]);
  const [badgeID, setBadgeID] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [openInfo, setOpenInfo] = React.useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success" as AlertColor);
  const { register, handleSubmit } = useForm();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickOpen2 = (badge: string) => {
    setBadgeID(badge);
    getExerciceByBadgeId(badge).then((e) => {
      setExercices(e);
    });
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      languages.find(
        (l) => l._id === event.target.value && selectLanguage.push(l)
      );
    } else {
      selectLanguage.find(
        (l) =>
          l._id === event.target.value &&
          selectLanguage.splice(selectLanguage.indexOf(l), 1)
      );
    }
  };

  const handleCloseInfo = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenInfo(false);
  };

  let session: ISessionModel = JSON.parse(
    localStorage.getItem("session") || ""
  );

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#1d1d1b",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: "white",
  }));

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || ""));
    getBadges().then((badges) => {
      setBadges(badges);
    });
    getSessions().then((s) => {
      setSessions(s);
    });
    getLanguages().then((l) => {
      setLanguages(l);
    });
  }, []);

  function handleClickUser(id: string) {
    navigate(`/user/${id}`);
  }

  function checkBadge(badge: IBadgesModel) {
    if (session.badges.find((badges) => badges._id === badge._id)) {
      return true;
    } else {
      return false;
    }
  }

  const onSubmit = async (data: any) => {
    setOpen(false);
    data.language = selectLanguage;
    createBadge(data)
      .then((d) => {
        setSeverity("success");
        setMessage("Le badge a bien été créé !");
        setOpenInfo(true);
        getBadges().then((b) => {
          badges.splice(0, badges.length);
          setBadges(b);
        });
      })
      .catch((e) => {
        setSeverity("error");
        setMessage("Une erreur est survenue lors de la création du badge");
        setOpenInfo(true);
        setOpen(true);
      });
  };

  const deleteBadgeId = (badge: string) => {
    deleteBadge(badge)
      .then((d) => {
        setOpen2(false);
        setSeverity("success");
        setMessage("Le badge a bien été supprimé !");
        setOpenInfo(true);
        getBadges().then((b) => {
          badges.splice(0, badges.length);
          setBadges(b);
        });
      }
      )
      .catch((e) => {
        setOpen2(false);
        setSeverity("error");
        setMessage("Une erreur est survenue lors de la suppression du badge");
        setOpenInfo(true);
        setOpen2(true);
      }
      );
  }

  const deleteExercice = (exercice: IExerciceModel) => {
    deleteExerciceById(exercice._id)
      .then((d) => {
        setOpen2(false);
        setSeverity("success");
        setMessage("L'exercice a bien été supprimé !");
        setOpenInfo(true);
        getExerciceByBadgeId(exercice.badges._id).then((e) => {
          exercices.splice(0, exercices.length);
          setExercices(e);
        });
      }
      )
      .catch((e) => {
        setSeverity("error");
        setMessage("Une erreur est survenue lors de la suppression de l'exercice");
        setOpenInfo(true);
        setOpen2(true);
      }
      );
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Snackbar
          open={openInfo}
          autoHideDuration={8000}
          onClose={handleCloseInfo}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity={severity}
            sx={{ width: "100%" }}
            onClose={handleCloseInfo}
          >
            {message}
          </Alert>
        </Snackbar>
        <Grid container spacing={3}>
          <Grid xs={1}></Grid>
          <Grid xs={3}>
            <Item sx={{ height: "55vh" }}>
              <h1>Utilisateur</h1>
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
              >
                {sessions.length === 0 ? (
                  <CircularProgress sx={{ margin: "auto" }} />
                ) : (
                  sessions.map((_, index) => (
                    <Grid xs={2} sm={4} md={4} key={index}>
                      <>
                        <Avatar
                          sx={{ width: 56, height: 56, margin: "auto" }}
                          onClick={() =>
                            handleClickUser(sessions[index].user.id)
                          }
                        >
                          {sessions[index].user.firstName
                            ?.charAt(0)
                            .toUpperCase()}{" "}
                          {sessions[index].user.lastName
                            ?.charAt(0)
                            .toUpperCase()}
                        </Avatar>
                        <p>{sessions[index].user.username}</p>
                      </>
                    </Grid>
                  ))
                )}
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
                              onClick={() =>
                                handleClickOpen2(badges[index]._id)
                              }
                            />
                          </Badge>
                        ) : (
                          <Avatar
                            alt={badges[index].name}
                            src={badges[index].image}
                            sx={{ width: 56, height: 56, margin: "auto" }}
                            onClick={() => handleClickOpen2(badges[index]._id)}
                          />
                        )}
                        <p>{badges[index].name}</p>
                      </>
                    </Grid>
                  ))
                )}
              </Grid>
              <Button
                onClick={handleClickOpen}
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
                Ajouter
              </Button>
              <Dialog open={open2} onClose={handleClose2}>
                {/* permet de voir les exercice d'un badge de le delete et dans rajouter mais aussi un boutton pour delete le badge */}
                <DialogTitle>Exercices</DialogTitle>
                <DialogContent>
                  <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                  >
                    {/* Liste d'exercice avec un boutton delete */}
                    {exercices.length === 0 ? (
                      <p>Aucun exercice</p>
                    ) : (
                      <TableContainer>
                        <Table
                          aria-label="simple table"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>Exercice</TableCell>
                              <TableCell>Consigne</TableCell>
                              <TableCell>Supprimer</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {exercices.map((_, index) => (
                              <TableRow
                                key={index}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell component="th" scope="row">
                                  {exercices[index].name}
                                </TableCell>
                                <TableCell>
                                  {exercices[index].statement}
                                </TableCell>
                                <TableCell>
                                  <IconButton aria-label="delete" onClick={() => {deleteExercice(exercices[index])}}>
                                    <DeleteIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </Grid>
                </DialogContent>
                <DialogActions>
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
                    onClick={handleClose2}
                  >
                    Fermer
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
                    onClick={handleClose2}
                  >
                    Creer un exercice
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    onClick={() => {deleteBadgeId(badgeID)}}
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
                    Supprimer le badge
                  </Button>
                </DialogActions>
              </Dialog>
              <Dialog open={open} onClose={handleClose}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <DialogTitle>Creer un badge</DialogTitle>
                  <DialogContent>
                    <FormGroup>
                      {languages.map((_, index) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              onChange={handleChange}
                              value={languages[index]._id}
                            />
                          }
                          label={languages[index].name}
                        />
                      ))}
                    </FormGroup>
                    <TextField
                      {...register("name")}
                      autoFocus
                      margin="dense"
                      id="nom"
                      label="Nom du badge"
                      type="texte"
                      fullWidth
                      variant="standard"
                      color="error"
                    />
                    <TextField
                      {...register("image")}
                      autoFocus
                      margin="dense"
                      id="image"
                      label="URL de l'image"
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
                      Cancel
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
                      Creer
                    </Button>
                  </DialogActions>
                </form>
              </Dialog>
            </Item>
          </Grid>
          <Grid xs={1}></Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AccueilAdmin;
