import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import IBadgesModel from "../model/IBadgesModel";
import IUserModel from "../model/IUserModel";
import ISessionModel from "../model/ISessionModel";
import ILanguageModel from "../model/ILanguageModel";
import { getBadges, createBadge } from "../services/badges-service";
import { getUser, getUsers } from "../services/keycloak-service";
import { getSessions } from "../services/session-service";
import { getLanguages } from "../services/language-service";
import Autocomplete from "@mui/material/Autocomplete";
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
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const AccueilAdmin = () => {
  const [badges, setBadges] = useState<IBadgesModel[]>([]);
  const [user, setUser] = useState<IUserModel>();
  const [sessions, setSessions] = useState<ISessionModel[]>([]);
  const [languages, setLanguages] = useState<ILanguageModel[]>([]);
  const [selectLanguage, setSelectLanguage] = useState<ILanguageModel[]>([]);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [openInfo, setOpenInfo] = React.useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success" as AlertColor);
  const { register, handleSubmit } = useForm();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const handleChange = (lang: ILanguageModel) => {
  //   // setSelectLanguage(event.target.value as string);
  //   console.log(lang)
  //   selectLanguage.push(lang)
  //   console.log(selectLanguage)
  // };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.checked)
    console.log(event.target.value)
    
    if(event.target.checked){
      languages.find((l) => 
        {
          if(l !== undefined){
            selectLanguage.push(l)
          } 
        }
      )
    }else {
      languages.find((l) => 
        {
          if(l !== undefined){
            selectLanguage.filter(lang => lang._id === l._id)
          } 
        }
      )
    }
    console.log(selectLanguage)
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

  function handleClick(id: string) {
    console.log(id);
    navigate(`/exercices/${id}`);
  }

  function handleClickUser(id: string) {
    console.log(id);
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
    console.log(data);
    createBadge(data)
      .then((d) => {
        console.log(d);
        setSeverity("success");
        setMessage("Bravo, vous avez réussi l'exercice !");
        setOpenInfo(true);
      })
      .catch((e) => {
        console.log(e);
        setSeverity("error");
        setMessage("Bravo, vous avez réussi l'exercice !");
        setOpenInfo(true);
        setOpen(true);
      });
  };

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
              <Dialog open={open} onClose={handleClose}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <DialogTitle>Creer un badge</DialogTitle>
                  <DialogContent>
                    {/* <FormControl
                      variant="standard"
                      sx={{ minWidth: 120, marginTop: "20px" }}
                      color="error"
                    >
                      <InputLabel id="langageID">Langage</InputLabel>
                      <Select
                        labelId="langageID"
                        id="langage"
                        // value={selectLanguage}
                        onChange={handleChange}
                        label="Langage"
                        color="error"
                      >
                        {languages.map((_, index) => (
                          <MenuItem value={languages[index].name}>
                            {languages[index].name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl> */}
                    {languages.map((_, index) => (
                          <FormControlLabel
                          control={<Checkbox onChange={handleChange} value={languages[index]._id}/>}
                          label={languages[index].name}
                        />
                        ))}
                    <Autocomplete
                      multiple
                      onChange={(e, data: ILanguageModel[]) => {
                        setSelectLanguage(data);
                      }}
                      sx={{ maxWidth: "100%", m: "auto" }}
                      id="tags-outlined"
                      options={languages}
                      getOptionLabel={(option: ILanguageModel) => option.name}
                      renderInput={(params: any) => (
                        <TextField
                          {...params}
                          label="langages"
                          placeholder="Language"
                        />
                      )}
                    />
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
