import React from "react";
import PropTypes from "prop-types";
// material
import { CssBaseline } from "@mui/material";
import { ThemeProvider as MUIThemeProvider, createTheme } from "@mui/material/styles";
//
import palette from "../assets/palette";

// ----------------------------------------------------------------------
ThemeProvider.propTypes = {
  children: PropTypes.node,
};
const themeOptions = {
  palette,
};
export const theme = createTheme(themeOptions);

export default function ThemeProvider({ children }) {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}