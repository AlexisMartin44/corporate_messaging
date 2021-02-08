import { Link } from "react-router-dom";
import React from "react";
import firebase from "firebase";
import useStyles from "../../styles/login&register/loginStyle";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Copyright from "./../partials/copyright";
import withStyles from "@material-ui/core/styles/withStyles";

import {
  Avatar,
  TextField,
  Paper,
  Grid,
  CssBaseline,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
} from "@material-ui/core";

class LoginComponent extends React.Component {
  constructor() {
    super();

    this.state = {
      email: null,
      password: null,
      loginError: false,
    };
  }

  //CssBaseline allows to style by default <html> and <body> with UI material styles
  //Paper is used to give the appearance of a card that emerges from the screen
  render() {
    const { classes } = this.props;
    return (
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Log In
            </Typography>
            <form className={classes.form} onSubmit={e => this.submitLogin(e)}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={e => this.userTyping("email", e)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="password"
                onChange={e => this.userTyping("password", e)}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Log In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link to="/login" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/register" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </div>
        </Grid>
      </Grid>
    );
  }

  userTyping = (whichInput, event) => {
    switch (whichInput) {
      case "email":
        this.setState({ email: event.target.value });
        break;

      case "password":
        this.setState({ password: event.target.value });
        break;

      default:
        break;
    }
  };

  submitLogin = async e => {
    e.preventDefault(); // This is to prevent the automatic refreshing of the page on submit.

    await firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(
        () => {
          this.props.history.push("/dashboard");
        },
        err => {
          this.setState({ serverError: true });
          console.log("Error logging in: ", err);
        }
      );
  };
}

//We export the component by applying the corresponding stylesheet to it
export default withStyles(useStyles)(LoginComponent);
