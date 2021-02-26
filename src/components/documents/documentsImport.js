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


//List of company positions
const positions = ["Ingénieur", "Stagiaire", "CPO", "Technicien"];
//List of company services
const services = ["Sécurité", "Administration", "Commercial"];

/**
 * @desc Change the style of the selected elements
 * @function
 * @param {string} name - Name of the position or service
 * @param {Object} destinationFiles - List of selected positions or services 
 */
function getStyles(name, destinationFiles) {
  return {
    fontWeight: destinationFiles.indexOf(name) === -1 ? "250" : "400",
  };
}

/**
 * @classdesc Component allowing to add files in the database according to positions or services
 * @class
 * @extends React.Component
 */
class DocumentImportComponent extends React.Component {
  constructor(props) {
    super();
    //State that contains the files to be sent, the choice between position or service, the services or positions selected 
    this.state = {
      files: null,
      selectValue: "",
      destinationFiles: [],
      progress: 0,
    };
  }

  /**
   * @desc Updates the state according to the input
   * @param {string} whichInput - Name of the input to update in state
   * @param {event} event 
   * @function
   */
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

  /**
   * @desc Sends files to the database
   * @function
   */
  handleSave = async () => {
    if (
      this.state.selectValue != "" &&
      this.state.destinationFiles.length > 0
    ) {
      let file = this.state.files[0];
      let bucketName = "pdf";
      //Classics requests with firebase
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
          //Store files in a folder for pdf
          await firebase
            .storage()
            .ref("pdf")
            .child(file.name)
            .getDownloadURL()
            .then(url => {
              if (this.state.selectValue == "service") {
                //Adds in the files table of the database the information of the added file
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

  /**
   * @desc Render method of the DocumentImportComponent
   * @function
   */
  render() {
    //Styles classes
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <FormControl className={classes.formControl}>
          {/* First input, to choose between service or position  */}
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
          {/* Second input, to choose between services or positions */}
          <InputLabel id="destinationNameLabel">Destination Name</InputLabel>
          <Select
            labelId="destinationNameLabel"
            id="destinationName"
            multiple
            value={this.state.destinationFiles}
            onChange={e => this.handleChange("destinationName", e)}
            input={<Input />}
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
          {/* Button to select files to add */}
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
          // Button to send files
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

//export the component with his styles
export default withStyles(styles)(DocumentImportComponent);
