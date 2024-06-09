import { Grid, Typography } from "@mui/material";
import React from "react";

import * as constants from "./constants";
import * as styles from "./styles";
const PasswordStrengthBar = ({ value }) => {
  if (value) {
    const color = constants.getColorToPasswordStrength(value);
    let message = null;
    switch (color) {
      case constants.ERROR:
        message = constants.NEW_PASSWORD_MESSAGE_ERROR;
        break;
      case constants.WARNING:
        message = constants.NEW_PASSWORD_MESSAGE_WARNING;
        break;
      case constants.SUCCESS:
        message = constants.NEW_PASSWORD_MESSAGE_SUCCESS;
        break;
      default:
        break;
    }
    return (<>
      <Grid container spacing={1}>
        {color === constants.ERROR | color === constants.WARNING | color === constants.SUCCESS ? <Grid item xs={4}>
          <Typography height={8} component="div" bgcolor={(theme) => theme.palette[color].main}></Typography>
        </Grid> : null}
        {color === constants.WARNING | color === constants.SUCCESS ? <Grid item xs={4}>
          <Typography component="div" height={8} bgcolor={(theme) => theme.palette[color].main}></Typography>
        </Grid> : null}
        {color === constants.SUCCESS ? <Grid item xs={4}>
          <Typography component="div" height={8} bgcolor={(theme) => theme.palette[color].main}></Typography>
        </Grid> : null}
      </Grid >
      <Typography component="span" color={(theme) => theme.palette[color].main} sx={styles.passwordStrengthMessage}>
        {(`${message}`)}
      </Typography>
    </>);
  }
  return <></>;
};

export default PasswordStrengthBar;
