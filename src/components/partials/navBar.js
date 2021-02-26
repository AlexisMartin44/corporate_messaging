import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  IconButton,
  Popover,
  Box,
  Paper
} from "@material-ui/core";
import firebase from "firebase";
import NotificationsIcon from "@material-ui/icons/Notifications";
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';


/**
 * @function
 * @desc Styles of NavBar
 * @param {*} theme 
 */
const useStyles = theme => ({
  root: {
    flexGrow: 1,
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    minHeight: "64px",
  },
  appBar: {
    minHeight: "64px",
  },
  box: {
    padding: "48px",
    [theme.breakpoints.down(540)]: {
      padding: 0,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  paper: {
    display: "flex",
    alignItems: "center",
    margin: "10px",
  },
  typoDiv: {
    margin: "10px",
    width: "250px",
  },
  typo: {
    [theme.breakpoints.down(540)]: {
      fontSize: "10px",
    },
  },
  buttonDiv: {
    margin: "5px",
    marginLeft: "30px",
    display: "flex",
    flexDirection: "column",
    justifySelf: "end"
  },
  margin: {
    marginBottom: "5px"
  },
  button: {
    [theme.breakpoints.down(540)]: {
      width: "10px",
      fontSize: "10px",
    },
  }
});

/** 
 * @classdesc Application navigation bar, allows to log out, and to see the registration requests if the logged-in user is an admin 
 * @class
 * @param {Object} applicationRequests - List of registration requests
 * @extends React.Component  */
class NavBar extends React.Component {


  render() {
    //Style classes
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <Typography variant="h6" className={classes.title}>
              Corporate Messaging
            </Typography>
            {
              this.props.applicationRequests.length > 0 ?
                <div className={classes.sectionDesktop}>
                  <PopupState variant="popover" popuId="popApplications">
                    {(popupState) => (
                      <div>
                        <IconButton aria-label="show notifications" color="inherit" {...bindTrigger(popupState)}>
                          <Badge badgeContent={this.props.applicationRequests.length} color="secondary">
                            <NotificationsIcon />
                          </Badge>
                        </IconButton>
                        <Popover
                          {...bindPopover(popupState)}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                          }}
                        >
                          <Box className={classes.box}>
                            {this.props.applicationRequests.map((application, _index) => {
                              return (
                                <div key={_index}>
                                  <Paper className={classes.paper}>
                                    <div className={classes.typoDiv}>
                                      <Typography className={classes.typo} variant="button">{application.email}</Typography>
                                      <Typography className={classes.typo} variant="caption" display="block">{application.firstName} {application.lastName}</Typography>
                                      <Typography className={classes.typo} variant="caption" display="block">{application.service}</Typography>
                                      <Typography className={classes.typo} variant="caption" display="block">{application.position}</Typography>
                                    </div>
                                    <div className={classes.buttonDiv}>
                                      <Button onClick={this.addApplication.bind(this, application)} className={[classes.margin, classes.button].join(' ')} variant="contained" color="primary">Accept</Button>
                                      <Button onClick={this.deleteApplication.bind(this, application)} className={classes.button} variant="contained" color="secondary">Decline</Button>
                                    </div>
                                  </Paper>
                                </div>
                              )
                            })}
                          </Box>
                        </Popover>
                      </div>
                    )}
                  </PopupState>
                </div> : <div></div>
            }
            <Button
              onClick={async () => {
                this.props.history.push("/login");
                await firebase.auth().signOut();
              }}
              color="inherit"
            >
              Log out
            </Button>
          </Toolbar>
        </AppBar>
      </div >
    );
  }

  /**
   * @desc Delete an application request
   * @param {Object} application - The application to delete
   * @function
   */
  deleteApplication = async application => {
    await firebase
      .firestore()
      .collection("applicationRequest")
      .doc(application.email)
      .delete();
  };

  /**
   * @desc Add an application request
   * @param {Object} application - The application to add
   * @function
   */
  addApplication = async application => {

    //Creates a second instance of connection to the database so that the user is not logged in when adding a new member
    const config = {
      apiKey: "AIzaSyA4q3i0kbwLYXW2S-KsMJ0-cEkSHVaTF2o",
      authDomain: "msg-instant.firebaseapp.com",
      projectId: "msg-instant",
    };
    const secondaryApp = firebase.initializeApp(config, "Secondary");


    secondaryApp
      .auth()
      .createUserWithEmailAndPassword(application.email, application.password)
      .then(
        //Creation of the object to send in the database
        authRes => {
          const userObj = {
            email: authRes.user.email,
            service: application.service,
            position: application.position,
            firstName: application.firstName,
            lastName: application.lastName,
            date: application.date,
            isAdmin: false,
            image: ""
          };
          secondaryApp
            .firestore()
            .collection("users")
            .doc(application.email)
            .set(userObj)
            .then(
              async () => {
                await secondaryApp
                  .firestore()
                  .collection("applicationRequest")
                  .doc(application.email)
                  .delete();
                secondaryApp.auth().signOut();
                secondaryApp.delete();
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

  /**
   * @desc Returns the user to the login page if he is not logged in
   * @function
   */
  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(async _usr => {
      if (!_usr) this.props.history.push("/login");
    });
  };
}

export default withStyles(useStyles)(NavBar);
