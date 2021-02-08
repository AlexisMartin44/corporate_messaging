import { Link } from "react-router-dom";
import React from "react";
import firebase from "firebase";
import useStyles from "../../styles/login&register/registerStyle";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Copyright from "./../partials/copyright";
import withStyles from "@material-ui/core/styles/withStyles";

import {
  Avatar,
  TextField,
  Container,
  Grid,
  CssBaseline,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
} from "@material-ui/core";
import { FlashAuto } from "@material-ui/icons";

class RegisterComponent extends React.Component {
  constructor() {
    super();

    this.state = {
      email: null,
      firstName: null,
      lastName: null,
      position: null,
      service: null,
      password: null,
      passwordConfirmation: null,
      signupError: "",
    };
  }

  //CssBaseline allows to style by default <html> and <body> with UI material styles
  //Paper is used to give the appearance of a card that emerges from the screen
  render() {
    const { classes } = this.props;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <form
            className={classes.form}
            onSubmit={e => this.submitSignup(e, this.state)}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="firstName"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={e => this.userTyping("firstName", e)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lastName"
                  onChange={e => this.userTyping("lastName", e)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={e => this.userTyping("email", e)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="position"
                  label="Position"
                  name="position"
                  autoComplete="position"
                  onChange={e => this.userTyping("position", e)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="service"
                  label="Service"
                  name="service"
                  autoComplete="service"
                  onChange={e => this.userTyping("service", e)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="password"
                  onChange={e => this.userTyping("password", e)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password Confirmation"
                  type="password"
                  id="password-confirmation"
                  autoComplete="passwordConfirmation"
                  onChange={e => this.userTyping("passwordConfirmation", e)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I have read and agree with the privacy policy."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign Up
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link to="/login" variant="body2">
                  Already have an account? Log in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
    );
  }

  userTyping = (whichInput, event) => {
    switch (whichInput) {
      case "email":
        this.setState({ email: event.target.value });
        break;

      case "service":
        this.setState({ service: event.target.value });
        break;

      case "position":
        this.setState({ position: event.target.value });
        break;

      case "firstName":
        this.setState({ firstName: event.target.value });
        break;

      case "lastName":
        this.setState({ lastName: event.target.value });
        break;

      case "password":
        this.setState({ password: event.target.value });
        break;

      case "passwordConfirmation":
        this.setState({ passwordConfirmation: event.target.value });
        break;

      default:
        break;
    }
  };

  formIsValid = () => this.state.password === this.state.passwordConfirmation;

  submitSignup = (e, state) => {
    e.preventDefault(); // This is to prevent the automatic refreshing of the page on submit.
    if (!this.formIsValid()) {
      this.setState({ signupError: "Passwords do not match" });
      return;
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(
        authRes => {
          const userObj = {
            email: authRes.user.email,
            service: state.service,
            position: state.position,
            firstName: state.firstName,
            lastName: state.lastName,
            isAdmin: false,
            friends: [],
            messages: [],
          };
          firebase
            .firestore()
            .collection("users")
            .doc(this.state.email)
            .set(userObj)
            .then(
              () => {
                this.props.history.push("/dashboard");
              },
              dbErr => {
                console.log("Failed to add user to the database: ", dbErr);
                this.setState({ signupError: "Failed to add user" });
              }
            );
        },
        authErr => {
          console.log("Failed to create user: ", authErr);
          this.setState({ signupError: "Failed to add user" });
        }
      );
  };
}

//We export the component by applying the corresponding stylesheet to it
export default withStyles(useStyles)(RegisterComponent);
