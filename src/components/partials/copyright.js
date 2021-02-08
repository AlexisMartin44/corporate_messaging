import React from "react";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="/dashboard">
        Corporate Messaging
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default Copyright;
