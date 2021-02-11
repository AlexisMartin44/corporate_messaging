import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  IconButton,
} from "@material-ui/core";
import firebase from "firebase";
import NotificationsIcon from "@material-ui/icons/Notifications";

const useStyles = theme => ({
  root: {
    flexGrow: 1,
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
});

class NavBar extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Corporate Messaging
            </Typography>
            <div className={classes.sectionDesktop}>
              <IconButton aria-label="show notifications" color="inherit">
                <Badge badgeContent={17} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </div>
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
      </div>
    );
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(async _usr => {
      if (!_usr) this.props.history.push("/login");
    });
  };
}

export default withStyles(useStyles)(NavBar);
