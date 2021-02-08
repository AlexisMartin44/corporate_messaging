import React from "react";
import { withStyles, Tabs, Tab, Paper } from "@material-ui/core";
import styles from "../../styles/dashboard/dashboardStyle";
import ChatIcon from "@material-ui/icons/Chat";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import PersonPinIcon from "@material-ui/icons/PersonPin";
import MessageComponent from "../messages/messageComponent";
import firebase from "firebase";
import NavBar from "../partials/navBar";
import DocumentComponent from "./documents";
import ProfileComponent from "./profile";

class DashboardComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      image: "",
      isAdmin: false,
      chats: [],
      value: 2,
    };
  }
  render() {
    const { classes } = this.props;

    const handleChange = (event, newValue) => {
      this.setState({ value: newValue });
    };
    return (
      <div>
        <NavBar history={this.props.history} />
        <Paper square className={classes.root}>
          <Tabs
            value={this.state.value}
            onChange={handleChange}
            variant="fullWidth"
            indicatorColor="secondary"
            textColor="secondary"
            aria-label="icon label tabs example"
          >
            <Tab icon={<ChatIcon />} label="Messages" />
            <Tab icon={<InsertDriveFileIcon />} label="Documents" />
            <Tab icon={<PersonPinIcon />} label="Profile" />
          </Tabs>
        </Paper>
        {this.state.value === 0 && (
          <MessageComponent history={this.props.history} />
        )}
        {this.state.value === 1 && <DocumentComponent />}
        {this.state.value === 2 && (
          <ProfileComponent image={this.state.image} user={this.state.email} />
        )}
      </div>
    );
  }

  componentWillMount = () => {
    firebase.auth().onAuthStateChanged(async _usr => {
      if (_usr) {
        await firebase
          .firestore()
          .collection("users")
          .onSnapshot(async res => {
            const users = res.docs.map(_doc => _doc.data());
            let userData;
            for (let user of users) {
              if (user.email === _usr.email) {
                userData = user;
                break;
              }
            }
            await this.setState({
              email: _usr.email,
              image: userData.image,
              isAdmin: userData.isAdmin,
              friends: [],
            });
          });
      }
    });
  };
}

export default withStyles(styles)(DashboardComponent);