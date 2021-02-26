import React from "react";
import { withStyles, Tabs, Tab, Paper } from "@material-ui/core";
import styles from "../../styles/dashboard/dashboardStyle";
import ChatIcon from "@material-ui/icons/Chat";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import PersonPinIcon from "@material-ui/icons/PersonPin";
import MessageComponent from "../messages/messageComponent";
import firebase from "firebase";
import NavBar from "../partials/navBar";
import DocumentComponent from "../documents/documents";
import ProfileComponent from "./profile";

/** 
 * @classdesc Main component of the application, mother component of the other components
 * @class
 * @extends React.Component  */
class DashboardComponent extends React.Component {
  constructor() {
    super();
    /** State that contains all chats, the data of the logged-in user, the tab displayed, and registration requests */
    this.state = {
      chats: [],
      value: 0,
      userData: "",
      applicationRequests: [],
    };
  }

  /** 
   * Render method of DashboardComponent
   * @method
   */
  render() {
    // Styles classes
    const { classes } = this.props;

    /**
     * @desc Causes a change of tab and thus of the displayed daughter component
     * @param {event} event
     * @param {int} newValue - The value of the tab to be displayed
     * @method */
    const handleChange = (event, newValue) => {
      this.setState({ value: newValue });
    };

    return (
      //Depending on the value of the state, displays different components
      //The Paper component corresponds to the tab at the bottom to changes the component page
      <div>
        {this.state.value === 0 && (
          <MessageComponent history={this.props.history} />
        )}
        {this.state.value === 1 && (
          <DocumentComponent
            isAdmin={this.state.userData.isAdmin}
            service={this.state.userData.service}
            position={this.state.userData.position}
          />
        )}
        {this.state.value === 2 && (
          <ProfileComponent toShow={false} userData={this.state.userData} />
        )}
        <NavBar
          history={this.props.history}
          applicationRequests={this.state.applicationRequests}
        />
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
      </div>
    );
  }

  /**
   * @function
   * @desc gets invoked right after a React component has been mounted, allows to update the state
   */
  componentDidMount = async () => {
    firebase.auth().onAuthStateChanged(async _usr => {
      //if a user is logged-in
      if (_usr) {
        //This first call allows to load the data of the connected user
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

            //Update the state
            await this.setState({
              userData: userData,
              friends: [],
            });

            //If the user is an admin, the registration requests are uploaded
            if (userData.isAdmin) {
              await firebase
                .firestore()
                .collection("applicationRequest")
                .onSnapshot(async res => {
                  this.setState({
                    applicationRequests: res.docs.map(_doc => _doc.data()),
                  });
                  this.setState({ value: 2 });
                });
            }
          });
      }
    });

  };
}

//export the component with his styles
export default withStyles(styles)(DashboardComponent);
