import { Link } from "react-router-dom";
import React from "react";
import firebase from "firebase";
import useStyles from "../../styles/login&register/registerStyle";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Copyright from "./../partials/copyright";
import withStyles from "@material-ui/core/styles/withStyles";
import joi from "joi";
import {
  Avatar,
  TextField,
  Container,
  Grid,
  CssBaseline,
  Typography,
  Button,
  Box,
} from "@material-ui/core";

require("joi");
//Joi schema that allows to validate inputs values
const schema = joi.object().keys({
  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .min(3)
    .max(45)
    .required(),
  service: joi.string().min(3).max(45).required(),
  position: joi.string().min(3).max(45).required(),
  firstName: joi.string().min(3).max(45).required(),
  lastName: joi.string().min(3).max(45).required(),
  password: joi
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,25})$/
    )
    .required(),
  date: joi.any().required(),
});

/**
 * @classdesc Register component, allows to send a register request to admins
 * @class
 * @extends React.Component  */
class RegisterComponent extends React.Component {
  constructor() {
    super();
    //State that contains input values
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

  /**
   * @desc Render method of RegisterComponent
   * @function
   */
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
          <form className={classes.form} onSubmit={e => this.submitSignup(e)}>
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
                <Typography
                  className={classes.typo}
                  variant="subtitle1"
                  color="secondary"
                >
                  {this.state.signupError}
                </Typography>
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

  /**
   * Update the state with the values entered
   * @param {string} whichInput - Select the value of the state to update
   * @param {event} event
   */
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

  /**
   * Allows to send the registration request to the database
   * @function
   * @param {event} e
   */
  submitSignup = async e => {
    e.preventDefault(); // This is to prevent the automatic refreshing of the page on submit.
    if (!(this.state.password === this.state.passwordConfirmation)) {
      this.setState({ signupError: "Passwords do not match" });
      return;
    }

    try {
      const dataToValidate = {
        email: this.state.email,
        service: this.state.service,
        position: this.state.position,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        password: this.state.password,
        date: Date.now(),
      };
      //Check is data is valid
      const result = schema.validate(dataToValidate);
      if (result.error) {
        throw result.error.details[0].message;
      }

      //Retrieves registration requests
      await firebase
        .firestore()
        .collection("applicationRequest")
        .doc(this.state.email)
        .set(dataToValidate)
        .then(() => {
          this.props.history.push("/login");
        });
    } catch (e) {
      this.setState({ signupError: e });
    }
  };
}

//We export the component by applying the corresponding stylesheet to it
export default withStyles(useStyles)(RegisterComponent);
