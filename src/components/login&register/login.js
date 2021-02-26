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

/** 
 * @classdesc Login component with email and password
 * @class
 * @extends React.Component  */
class LoginComponent extends React.Component {
  constructor() {
    super();
    //State that contains email and password
    this.state = {
      email: null,
      password: null,
      loginError: false,
    };
  }

  /** 
   * @desc Render method of LoginComponent
   * @function
   */
  render() {
    //Styles classes
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
              {
                this.state.loginError ? <Typography className={classes.typo} variant="subtitle1" color="secondary">Wrong email or password</Typography> : null
              }
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

  /** 
   * Update the state when an input has a new value
   * @function 
   * @param {string} whichInput - Name of the state to update
   */
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

  /**
   * @param {event} e
   * @desc Submit the login
  */
  submitLogin = async e => {
    e.preventDefault(); // This is to prevent the automatic refreshing of the page on submit.

    //Sends a database connection request
    await firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(
        () => {
          this.props.history.push("/dashboard");
        },
        err => {
          this.setState({ loginError: true });
          console.log("Error logging in: ", err);
        }
      );
  };
}

//We export the component by applying the corresponding stylesheet to it
export default withStyles(useStyles)(LoginComponent);
