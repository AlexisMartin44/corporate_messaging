import React from "react";
import styles from "../../styles/dashboard/documentsStyle";
import { withStyles } from "@material-ui/core/styles";
import { IconButton, Button } from "@material-ui/core";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import firebase from "firebase";

class DocumentComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      files: null,
    };
  }

  handleChange = files => {
    this.setState({
      files: files,
    });
  };

  handleSave = () => {
    let bucketName = "pdf";
    let file = this.state.files[0];
    let storageRef = firebase.storage().ref(`${bucketName}/${file.name}`);
    let uploadTask = storageRef.put(file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, () => {
      let downloadURL = uploadTask.snapshot.downloadURL;
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <label htmlFor="contained-button-file">
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
          >
            <PictureAsPdfIcon />
          </IconButton>
        </label>
        <input
          accept=".pdf"
          className={classes.input}
          id="contained-button-file"
          multiple
          type="file"
          onChange={e => {
            this.handleChange(e.target.files);
          }}
        />
        <Button
          onClick={this.handleSave}
          variant="contained"
          color="primary"
          component="span"
          startIcon={<CloudUploadIcon />}
        >
          Upload
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(DocumentComponent);
