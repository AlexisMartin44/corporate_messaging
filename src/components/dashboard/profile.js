import React from "react";
import styles from "../../styles/dashboard/profileStyle";
import { withStyles } from "@material-ui/core/styles";
import firebase from "firebase";
import "firebase/storage";
import { Avatar, Button, Typography, Card, CardHeader, Divider, CardContent } from "@material-ui/core";

class ProfileComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      chatsLength: 0,
      positionLength: 0,
      serviceLength: 0,
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
    const date = new Date(this.props.userData.date);
    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          <CardHeader title="Profile" className={classes.cardHeader} />
          <Divider variant="middle" />
          <CardContent>
            {this.props.userData.isAdmin ? <Typography variant="h5" className={classes.typo}>Admin</Typography> : <div></div>}
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
            <Typography className={classes.typo} variant="h4">{this.props.userData.firstName} {this.props.userData.lastName}</Typography>
          </CardContent>
        </Card>
        <Card className={classes.secondCard}>
          <CardHeader title="Information" className={classes.cardHeader} />
          <Divider variant="middle" />
          <CardContent>
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
          <CardContent>
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
      </div>
    );
  }

  componentDidMount = () => {
    if (this.props.userData) {
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
      firebase
        .firestore()
        .collection("files")
        .where("services", "array-contains", this.props.userData.service)
        .onSnapshot(async res => {
          await this.setState({ serviceLength: res.docs.map(_doc => _doc.data()).length });
        });
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

export default withStyles(styles)(ProfileComponent);
