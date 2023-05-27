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
import { Button } from "@mui/material";

const Exercice = () => {
  const [srcDoc, setSrcDoc] = useState("");
  const [html, sethtml] = useState("");
  const [css, setcss] = useState("");
  const [javascript, setjavascript] = useState("");
  const [language, setlanguage] = useState("html");
  const [exercice, setexercice] = useState<IExerciceModel[]>([]);
  const [badges, setbadges] = useState<IBadgesModel[]>();

  const onChangeSelect = (event: any) => {
    setlanguage(event.target.value);
  };

  useEffect(() => {
    const fetchExercices = async (id: string) => {
      const exercice = await getExerciceByBadgeId(id).then((result: any) => {
        return result;
      });
      console.log(exercice);
      setexercice(exercice);
    };
    const getAllBadges = async () => {
      const badges = await getBadges().then((result: any) => result);
      console.log(badges);
      setbadges(badges);
    };

    const getBadge = async (id: string) => {
      const badge = await getBadgeById(id).then((result: any) => {
        return result;
      });
      console.log(badge);
      setbadges(badge);
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

  return (
    <Box sx={{ width: "100%", backgroundColor: "#1d1d1b", color: "white" }}>
      <Grid container spacing={1}>
        <Grid xs={1} md={1}>
          nav bar
        </Grid>
        <Grid xs={11} md={11}>
          <Box sx={{ width: "100%" }}>
            <Grid container spacing={1}>
              <Grid xs={6}>
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ height: "65vh" }}>
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
                    sx={{ color: "#ffffff", "&:after": { borderColor: "#ffffff" } }}
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
                    <p>{exercice[0]?.statement}</p>
                  </Box>
                </Box>
              </Grid>
              <Grid xs={6}>
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ height: "35vh" }}>
                    <Grid container spacing={2}>
                      <Grid xs={6}>
                        {/* Nombre d"erxercice restant a faire */}
                        <Box>
                          <h1>Nombre d'exercices</h1>
                          <p>{exercice.length}</p>
                        </Box>
                      </Grid>
                      <Grid xs={6}>
                        <Box>
                          <Button variant="contained" sx={
                            {
                              backgroundColor: "#db1144",
                              color: "#ffffff",
                              marginTop: "2vh",
                              '&:hover': {
                                backgroundColor: "#ffffff",
                                color: "#db1144"
                              }
                            }
                            
                          }>Valider</Button>
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
