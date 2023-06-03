import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import Editor from "@monaco-editor/react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import IExerciceModel from "../model/IExerciceModel";
import IBadgesModel from "../model/IBadgesModel";
import { getExerciceByBadgeId } from "../services/exercice-service";
import { getBadgeById, getBadges } from "../services/badges-service";
import { Alert, AlertColor, Button, Snackbar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import ISessionModel from "../model/ISessionModel";
import IDraftModel from "../model/IDraftModel";
import { useNavigate } from "react-router-dom";

const Exercice = () => {
  const [srcDoc, setSrcDoc] = useState("");
  const [html, sethtml] = useState("");
  const [css, setcss] = useState("");
  const [javascript, setjavascript] = useState("");
  const [language, setlanguage] = useState("html");
  const [exercice, setexercice] = useState<IExerciceModel[]>([]);
  const [exercices, setexercices] = useState<IExerciceModel[]>([]);
  const [badges, setbadge] = useState<IBadgesModel>();
  const [allBadges, setAllBadges] = useState<IBadgesModel[]>([]);
  const [currentExercice, setcurrentExercice] = useState(0);
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

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    const fetchExercices = async (id: string) => {
      const data = await getExerciceByBadgeId(id).then((result: any) => {
        setexercices(result);
        let exerxice: IExerciceModel[] = [];
        let myExercice: IExerciceModel[] = session.exercices;
        result.forEach((element: IExerciceModel) => {
          // if exercice is not in myExercice add it
          if (
            !myExercice.find(
              (exercice: IExerciceModel) => exercice._id === element._id
            )
          ) {
            exerxice.push(element);
          }
        });
        return exerxice;
      });
      setexercice(data);
    };
    const getAllBadges = async () => {
      const data = await getBadges().then((result: any) => result);
      setAllBadges(data);
    };

    const getBadge = async (id: string) => {
      const badge = await getBadgeById(id).then((result: any) => {
        return result;
      });
      setbadge(badge);
    };

    const url = window.location.href;
    const id = url.substring(url.lastIndexOf("/") + 1);
    fetchExercices(id).catch(console.error);
    getBadge(id).catch(console.error);
    getAllBadges().catch(console.error);
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

  // valider l'exercice
  const validateExercice = () => {
    if (replaceCode(srcDoc) === exercice[currentExercice]?.result) {
    session.exercices.push(exercice[currentExercice]);
    localStorage.setItem("session", JSON.stringify(session));
    setSeverity("success");
    setMessage("Bravo, vous avez réussi l'exercice !");
    setOpen(true);
    sethtml("");
    setcss("");
    setjavascript("");
    setcurrentExercice(currentExercice + 1);
    } else {
      setSeverity("error");
      setMessage("Désolé, vous n'avez pas réussi l'exercice !");
      setOpen(true);
    }
  };

  return (
    <Box sx={{ width: "100%", backgroundColor: "#1d1d1b", color: "white" }}>
      <Snackbar open={open} autoHideDuration={8000} onClose={handleClose} anchorOrigin={{vertical: "top", horizontal:"center"}}>
        <Alert severity={severity} sx={{ width: '100%' }} onClose={handleClose}>
          {message}
        </Alert>
      </Snackbar>
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
                          navigate(-2);
                        }}
                      >
                        <ArrowBackIcon />
                      </Button>
                    </Box>
                  </Box>

                  <Box sx={{ width: "100%", marginTop: "5vh" }}>
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
                          window.open(
                            exercice[currentExercice].help.toString()
                          );
                        }}
                      >
                        <QuestionMarkIcon />
                      </Button>
                    </Box>
                  </Box>

                  <Box sx={{ width: "100%", marginTop: "5vh" }}>
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
                            backgroundColor: "#db1144",
                            color: "#ffffff",
                          },
                        }}
                      >
                        Exercice {exercices.length}
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
                  <Box sx={{ height: "69.5vh", backgroundColor:"white"}}>
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
                    <h1>Exercice</h1>
                    <p>{exercice[currentExercice]?.statement}</p>
                  </Box>
                </Box>
              </Grid>
              <Grid xs={6}>
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ height: "35vh" }}>
                    <Grid container spacing={2}>
                      <Grid xs={6}>
                        <Box>
                          <h1>Console log</h1>
                        </Box>
                      </Grid>
                      <Grid xs={6}>
                        <Box>
                          <Button
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
                            onClick={() => {
                              validateExercice();
                            }}
                          >
                            Valider
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
    </Box>
  );
};

export default Exercice;
