import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import Editor from "@monaco-editor/react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import IBadgesModel from "../model/IBadgesModel";
import { styled } from "@mui/system";
import { getBadgeById } from "../services/badges-service";
import { Alert, AlertColor, Button, Snackbar, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ISessionModel from "../model/ISessionModel";
import IDraftModel from "../model/IDraftModel";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import { createExercice } from "../services/exercice-service";

const CreateExercice = () => {
  const [srcDoc, setSrcDoc] = useState("");
  const [html, sethtml] = useState("");
  const [css, setcss] = useState("");
  const [javascript, setjavascript] = useState("");
  const [language, setlanguage] = useState("html");
  const [badges, setbadge] = useState<IBadgesModel>();
  const { register, handleSubmit, reset } = useForm();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success" as AlertColor);
  const navigate = useNavigate();

  let session: ISessionModel = JSON.parse(
    localStorage.getItem("session") || ""
  );

  let draft: IDraftModel = JSON.parse(localStorage.getItem("draft") || "");

  const onChangeSelect = (event: any) => {
    setlanguage(event.target.value);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    const getBadge = async (id: string) => {
      const badge = await getBadgeById(id).then((result: any) => {
        return result;
      });
      setbadge(badge);
    };

    const url = window.location.href;
    const id = url.substring(url.lastIndexOf("/") + 1);
    getBadge(id).catch(console.error);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
          <html>
            <body>
                ${html}
            </body>
            <style>
                ${css}
            </style>
            <script>
                ${javascript}
            </script>
          </html>
        `);
    }, 250);

    return () => clearTimeout(timeout);
  }, [html, css, javascript]);

  const replaceCode = (code: string) => {
    return code
      .replace(/(\r\n|\n|\r)/gm, "")
      .replace(/;/g, "")
      .replace(/ /g, "")
      .replace(/"/g, "'");
  };

  const StyledTextarea = styled(TextareaAutosize)(
    ({ theme }) => `
    width: 78vh;
    font-weight: 400;
    line-height: 1.5;
    padding: 5px;
    border-radius: 12px 12px 0 12px;
    color: "black";
    background: "white";
  `
  );

  const onSubmit = async (data: any) => {
    const result = replaceCode(srcDoc);
    data.badges = badges;
    data.result = result;

    await createExercice(data)
      .then((result: any) => {
        console.log(result);
        sethtml("");
        setcss("");
        setjavascript("");
        reset();

        setSeverity("success");
        setMessage("Bravo, création de l'exercice réussi !");
        setOpen(true);
      })
      .catch((error: any) => {
        setSeverity("error");
        setMessage("Désolé, création de l'exercice échoué !");
        setOpen(true);
      });
        setTimeout(() => {
            navigate("/admin");
            }
        , 5000);
    };

  return (
    <Box sx={{ width: "100%", backgroundColor: "#1d1d1b", color: "white" }}>
      <Snackbar
        open={open}
        autoHideDuration={8000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={severity} sx={{ width: "100%" }} onClose={handleClose}>
          {message}
        </Alert>
      </Snackbar>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={1}>
          <Grid xs={1} md={1}>
            <Box sx={{ width: "100%" }}>
              <Box sx={{ height: "100vh" }}>
                <Grid container spacing={2}>
                  <Grid xs={12}>
                    <Box sx={{ width: "100%" }}>
                      <Box sx={{ height: "10vh" }}>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#db1144",
                            color: "#ffffff",
                            height: "10vh",
                            width: "10vh",
                            marginTop: "2vh",
                            "&:hover": {
                              backgroundColor: "#ffffff",
                              color: "#db1144",
                            },
                          }}
                          onClick={() => {
                            navigate("/admin");
                          }}
                        >
                          <ArrowBackIcon />
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
          <Grid xs={11} md={11}>
            <Box sx={{ width: "100%" }}>
              <Grid container spacing={1}>
                <Grid xs={6}>
                  <Box sx={{ width: "100%" }}>
                    <Box sx={{ height: "69.5vh", backgroundColor: "white" }}>
                      <iframe
                        srcDoc={srcDoc}
                        title="output"
                        sandbox="allow-scripts"
                        frameBorder="0"
                        width="100%"
                        height="100%"
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid xs={6}>
                  <FormControl
                    variant="standard"
                    sx={{
                      m: 1,
                      minWidth: 120,
                      backgroundColor: "#db1144",
                      marginLeft: "2.5vh",
                      marginTop: "2.5vh",
                      borderRadius: "5px",
                    }}
                  >
                    <Select
                      value={language}
                      onChange={onChangeSelect}
                      label="Language"
                      sx={{
                        color: "#ffffff",
                        "&:after": { borderColor: "#ffffff" },
                      }}
                    >
                      <MenuItem value={"html"}>HTML</MenuItem>
                      <MenuItem value={"css"}>CSS</MenuItem>
                      <MenuItem value={"javascript"}>JavaScript</MenuItem>
                    </Select>
                  </FormControl>
                  <Editor
                    height="63vh"
                    theme="vs-dark"
                    defaultLanguage={
                      language === "html"
                        ? "html"
                        : language === "css"
                        ? "css"
                        : "javascript"
                    }
                    value={
                      language === "html"
                        ? html
                        : language === "css"
                        ? css
                        : javascript
                    }
                    onChange={(value) => {
                      if (value === undefined) value = "";
                      language === "html"
                        ? sethtml(value)
                        : language === "css"
                        ? setcss(value)
                        : setjavascript(value);
                    }}
                  />
                </Grid>
                <Grid xs={6}>
                  <Box sx={{ width: "100%" }}>
                    <Box sx={{ height: "35vh" }}>
                      <h1>Consigne de l'exercice</h1>
                      <StyledTextarea
                        {...register("statement")}
                        aria-label="minimum height"
                        minRows={6}
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid xs={6}>
                  <Box sx={{ width: "100%" }}>
                    <Box sx={{ height: "35vh" }}>
                      <Grid container spacing={2}>
                        <Grid xs={6}>
                          <Box>
                            <h1>Info de l'exercice</h1>
                            <TextField
                              {...register("name")}
                              autoFocus
                              margin="dense"
                              id="nom"
                              label="Nom de l'exercice"
                              type="texte"
                              fullWidth
                              variant="standard"
                              color="error"
                              sx={{
                                backgroundColor: "white",
                                borderRadius: "5px",
                              }}
                            />
                            <TextField
                              {...register("help")}
                              autoFocus
                              margin="dense"
                              id="nom"
                              label="Url de la documentation"
                              type="texte"
                              fullWidth
                              variant="standard"
                              color="error"
                              sx={{
                                backgroundColor: "white",
                                borderRadius: "5px",
                              }}
                            />
                          </Box>
                        </Grid>
                        <Grid xs={6}>
                          <Box>
                            <Button
                              type="submit"
                              variant="contained"
                              sx={{
                                backgroundColor: "#db1144",
                                color: "#ffffff",
                                marginTop: "2vh",
                                "&:hover": {
                                  backgroundColor: "#ffffff",
                                  color: "#db1144",
                                },
                              }}
                            >
                              Créer l'exercice
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default CreateExercice;
