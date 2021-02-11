import React from "react";
import styles from "../../styles/documents/documentsImportStyle";
import { useTheme, withStyles } from "@material-ui/core/styles";
import {
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Input,
} from "@material-ui/core";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import firebase from "firebase";

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
};

const positions = ["Ingénieur", "Stagiaire", "CPO", "Technicien"];
const services = ["Sécurité", "Administration", "Commercial"];

function getStyles(name, destinationFiles) {
  return {
    fontWeight: destinationFiles.indexOf(name) === -1 ? "250" : "400",
  };
}

class DocumentImportComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      files: null,
      selectValue: "",
      destinationFiles: [],
      progress: 0,
    };
  }

  handleChange = (whichInput, event) => {
    switch (whichInput) {
      case "files":
        this.setState({ files: event });
        break;

      case "destination":
        this.setState({ selectValue: event.target.value });
        break;

      case "destinationName":
        this.setState({ destinationFiles: event.target.value });
        break;

      default:
        break;
    }
  };

  handleSave = async () => {
    if (
      this.state.selectValue != "" &&
      this.state.destinationFiles.length > 0
    ) {
      let file = this.state.files[0];
      let bucketName = "pdf";
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
            .ref("pdf")
            .child(file.name)
            .getDownloadURL()
            .then(url => {
              if (this.state.selectValue == "service") {
                firebase.firestore().collection("files").doc(file.name).set({
                  name: file.name,
                  services: this.state.destinationFiles,
                  positions: [],
                  url: url,
                  date: Date.now(),
                });
              } else {
                firebase.firestore().collection("files").doc(file.name).set({
                  name: file.name,
                  positions: this.state.destinationFiles,
                  services: [],
                  url: url,
                  date: Date.now(),
                });
              }
            });
        }
      );
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <FormControl className={classes.formControl}>
          <InputLabel id="destinationLabel">Destination</InputLabel>
          <Select
            labelId="destinationLabel"
            id="destination"
            value={this.state.selectValue}
            onChange={e => this.handleChange("destination", e)}
          >
            <MenuItem value={"position"}>Position</MenuItem>
            <MenuItem value={"service"}>Service</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="destinationNameLabel">Destination Name</InputLabel>
          <Select
            labelId="destinationNameLabel"
            id="destinationName"
            multiple
            value={this.state.destinationFiles}
            onChange={e => this.handleChange("destinationName", e)}
            input={<Input />}
            MenuProps={MenuProps}
          >
            {this.state.selectValue == "service"
              ? services.map(name => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, this.state.destinationFiles)}
                  >
                    {name}
                  </MenuItem>
                ))
              : positions.map(name => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, this.state.destinationFiles)}
                  >
                    {name}
                  </MenuItem>
                ))}
          </Select>
        </FormControl>

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
            this.handleChange("files", e.target.files);
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

export default withStyles(styles)(DocumentImportComponent);
