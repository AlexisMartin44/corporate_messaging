import React from "react";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

/**
 * @desc Copyright function, to easily add a copyright anywhere
 * @function
 */
const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="/dashboard" to="">
        Corporate Messaging
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default Copyright;
