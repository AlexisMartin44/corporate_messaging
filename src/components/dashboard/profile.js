import React from "react";
import styles from "../../styles/dashboard/profileStyle";
import { withStyles } from "@material-ui/core/styles";
import firebase from "firebase";
import "firebase/storage";
import { Avatar, Button, Typography, Card, CardHeader, Divider, CardContent } from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';

/** 
 * @classdesc Profile component, displays user information in parameter
 * @class
 * @param {boolean} toShow - True if the profile component is called to consult another user, false if not.
 * @param {Object} userData - Contains all the data of the user whose information you wish to see
 * @extends React.Component  */
class ProfileComponent extends React.Component {
  constructor(props) {
    super();
    //State that contains number of files and conversations of the user
    this.state = {
      chatsLength: 0,
      positionLength: 0,
      serviceLength: 0,
      progress: 0,
    };
  }


  /**
   * @desc Update state
   * @param {Object} files - Files that have been load from database
   * @function
   */
  handleChange = async files => {
    await this.setState({
      files: files,
    });
    this.handleSave();
  };

  /**
   * @function
   * @desc Change profile image
   */
  handleSave = () => {
    let bucketName = "image";
    let file = this.state.files[0];
    //Classic firebase requests to add a file in the firestore
    let storageRef = firebase.storage().ref(`${bucketName}/${file.name}`);
    let uploadTask = storageRef.put(file);
    uploadTask.on(
      "state_changed",
      snapshot => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ progress: progress });
      },
      error => {
        console.log(error);
      },
      async () => {
        //Stores the image in the database and updates the user's profile
        await firebase
          .storage()
          .ref("image")
          .child(file.name)
          .getDownloadURL()
          .then(url => {
            //Update in the database the url of the profile image
            firebase
              .firestore()
              .collection("users")
              .doc(this.props.userData.email)
              .update({
                image: url,
              });
          });
      }
    );
  };

  newMessage = () => {
    this.props.setUserToShow(this.props.userData);
    this.props.newChatBtnFn();
  }

  /**
   * @desc Render method of ProfileComponent
   * @function
   */
  render() {
    //Style classes
    const { classes } = this.props;
    //User creation date
    const date = new Date(this.props.userData.date);
    return (
      //The display is different depending on the parent component
      <div className={this.props.toShow ? classes.rootToShow : classes.root}>
        <Card className={this.props.toShow ? classes.cardToShow : classes.card}>
          <CardHeader title="Profile" className={classes.cardHeader} />
          <Divider variant="middle" />
          <CardContent className={classes.cardContent}>
            { //Displays data such as user photo, first and last name, and whether the user is admin or not
              this.props.userData.isAdmin ? <Typography variant="h5" className={classes.typo}>Admin</Typography> : <div></div>}
            { //It is possible to change your profile image only by looking at your profile
              this.props.toShow ? <Avatar
                src={this.props.userData.image}
                className={classes.largeToShow}
              /> : <div><input
                accept="image/*"
                className={classes.input}
                id="contained-button-file"
                type="file"
                onChange={e => {
                  this.handleChange(e.target.files);
                }}
              />
                  <label htmlFor="contained-button-file">
                    <Button className={classes.button} color="primary" component="span">
                      <Avatar
                        src={this.props.userData.image}
                        className={classes.large}
                      />
                    </Button>
                  </label></div>}
            <Typography className={this.props.toShow ? classes.typoToShow : classes.typo} variant="h4">{this.props.userData.firstName} {this.props.userData.lastName}</Typography>
          </CardContent>
        </Card>
        <div className={this.props.toShow ? classes.secondPartToShow : classes.secondPart}>
          <Card className={this.props.toShow ? classes.secondCardToShow : classes.secondCard}>
            <CardHeader title="Information" className={classes.cardHeader} />
            <Divider variant="middle" />
            <CardContent>
              {/* Display of data such as service, position, number of files, number of conversations, date of creation */}
              <div className={classes.element}>
                <Typography className={classes.typoElement} variant="h6">Service :</Typography>
                <Typography className={classes.typoElement} variant="body1">{this.props.userData.service}</Typography>
              </div>
              <div className={classes.element}>
                <Typography className={classes.typoElement} variant="h6">Position :</Typography>
                <Typography className={classes.typoElement} variant="body1">{this.props.userData.position}</Typography>
              </div>
              <div className={classes.element}>
                <Typography className={classes.typoElement} variant="h6">Registration :</Typography>
                <Typography className={classes.typoElement} variant="body1">{date.toLocaleDateString()}</Typography>
              </div>
            </CardContent>
            <Divider variant="middle" />
            <CardContent className={this.props.toShow ? classes.secondCardContent : null}>
              <div className={classes.stats}>
                <Typography variant="h6">{this.state.chatsLength}</Typography>
                <Typography className={classes.marginLeft} variant="body1">conversation</Typography>
              </div>
              <div className={classes.stats}>
                <Typography variant="h6">{this.state.positionLength + this.state.serviceLength}</Typography>
                <Typography className={classes.marginLeft} variant="body1">files</Typography>
              </div>
            </CardContent>
          </Card>
          {this.props.toShow ? <Button onClick={this.newMessage} className={classes.sendButton} variant="contained" color="primary">Message <SendIcon className={classes.sendIcon} /></Button> : <div></div>}
        </div>
      </div>
    );
  }

  /**
   * @desc Update the state with the values from the database
   * @function
   */
  componentDidMount = () => {
    if (this.props.userData) {
      //Retrieves messages
      firebase
        .firestore()
        .collection("chats")
        .where("users", "array-contains", this.props.userData.email)
        .onSnapshot(async res => {
          const chats = res.docs.map(_doc => _doc.data());
          await this.setState({
            chatsLength: chats.length,
          });
        });
      //Retrieves services files
      firebase
        .firestore()
        .collection("files")
        .where("services", "array-contains", this.props.userData.service)
        .onSnapshot(async res => {
          await this.setState({ serviceLength: res.docs.map(_doc => _doc.data()).length });
        });
      //Retrieves position files
      firebase
        .firestore()
        .collection("files")
        .where("position", "array-contains", this.props.userData.position)
        .onSnapshot(async res => {
          await this.setState({ positionLength: res.docs.map(_doc => _doc.data()).length });
        });
    }
  }
}

//export the component with his styles
export default withStyles(styles)(ProfileComponent);
