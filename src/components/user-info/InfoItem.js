import { Stack, Typography } from "@mui/material";
import React from "react";

const InfoItem = ({ icon, label, info }) => {
  return (
    <Stack spacing={2} alignItems={"center"} direction={"row"}>
      {icon}
      <Stack
        spacing={{
          xs: 0,
          md: 1,
        }}
        direction={{
          xs: "column",
          md: "row",
        }}
      >
        <Typography fontWeight={"bold"} display={{ xs: "none", md: "block" }}>
          {label}
        </Typography>
        <Typography>{info}</Typography>
        <Typography
          fontSize={"0.6rem"}
          color={"GrayText"}
          display={{ xs: "block", md: "none" }}
        >
          {label}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default InfoItem;
