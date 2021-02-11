import React from "react";
import styles from "../../styles/dashboard/profileStyle";
import { withStyles } from "@material-ui/core/styles";
import firebase from "firebase";
import "firebase/storage";
import { Avatar, Button, Paper, Typography } from "@material-ui/core";
import { CollectionsBookmarkOutlined } from "@material-ui/icons";

class ProfileComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      progress: 0,
    };
  }

  handleChange = async files => {
    await this.setState({
      files: files,
    });
    this.handleSave();
  };

  handleSave = () => {
    let bucketName = "image";
    let file = this.state.files[0];
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
        await firebase
          .storage()
          .ref("image")
          .child(file.name)
          .getDownloadURL()
          .then(url => {
            this.setState({ url: url });
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

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Paper elevation={3} className={classes.paper}>
          <input
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
          </label>
          <Typography>{this.props.userData.isAdmin}</Typography>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(ProfileComponent);
