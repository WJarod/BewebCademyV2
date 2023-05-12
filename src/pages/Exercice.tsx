import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Editor from "@monaco-editor/react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";

const Exercice = () => {
  const [srcDoc, setSrcDoc] = useState("");
  const [html, sethtml] = useState("");
  const [css, setcss] = useState("");
  const [javascript, setjavascript] = useState("");
  const [language, setlanguage] = useState("html");

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#1A2027",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: "fff",
  }));

  const onChangeSelect = (event : any) => {
    setlanguage(event.target.value);
  };

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
    <Box sx={{ width: "100%", backgroundColor: "#1e1e1e" }}>
      <Grid container spacing={1}>
        <Grid xs={1} md={1}>
          <Item sx={{ height: "100%" }}>nav bar</Item>
        </Grid>
        <Grid xs={11} md={11}>
          <Box sx={{ width: "100%" }}>
            <Grid container spacing={1}>
              <Grid xs={6}>
                <Box sx={{ width: "100%" }}>
                  <Item sx={{ height: "65vh" }}>
                    <iframe
                      srcDoc={srcDoc}
                      title="output"
                      sandbox="allow-scripts"
                      frameBorder="0"
                      width="100%"
                      height="100%"
                    />
                  </Item>
                </Box>
              </Grid>
              <Grid xs={6}>
                <FormControl
                  variant="standard"
                  sx={{
                    m: 1,
                    minWidth: 120,
                    backgroundColor: "#1A2027",
                    marginLeft: "2.5vh",
                  }}
                >
                  <Select
                    value={language}
                    onChange={onChangeSelect}
                    label="Language"
                  >
                    <MenuItem value={"html"}>HTML</MenuItem>
                    <MenuItem value={"css"}>CSS</MenuItem>
                    <MenuItem value={"javascript"}>JavaScript</MenuItem>
                  </Select>
                </FormControl>
                <Editor
                  height="63vh"
                  theme="vs-dark"
                  defaultLanguage={language === "html" ? "html" : language === "css" ? "css" : "javascript"}
                  value={language === "html" ? html : language === "css" ? css : javascript}
                  onChange={(value) => {
                    if (value === undefined) value = "";
                    language === "html" ? sethtml(value) : language === "css" ? setcss(value) : setjavascript(value);
                  }}
                />
              </Grid>
              <Grid xs={6}>
                <Box sx={{ width: "100%" }}>
                  <Item sx={{ height: "35vh" }}>item 3</Item>
                </Box>
              </Grid>
              <Grid xs={6}>
                <Box sx={{ width: "100%" }}>
                  <Item sx={{ height: "35vh" }}>item 4</Item>
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
