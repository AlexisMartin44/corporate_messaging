import React from "react";
import styles from "../../styles/documents/documentsStyle";
import { withStyles } from "@material-ui/core/styles";
import DocumentImportComponent from "./documentsImport";
import DocumentTableComponent from "./documentTable";
import firebase from "firebase";
import { Typography } from "@material-ui/core";

/**
 * @classdesc Document component, displays files
 * @class
 * @extends React.Component  */
class DocumentComponent extends React.Component {
  constructor(props) {
    super();
    //State with files concerning the connected user
    this.state = {
      serviceFiles: [],
      positionFiles: [],
    };
  }

  /**
   * @desc Update the state with the values from the database
   * @function
   */
  componentDidMount = async () => {
    await firebase
      .firestore()
      .collection("files")
      .where("services", "array-contains", this.props.service)
      .onSnapshot(async res => {
        //Retrieves all files related to the service of the logged-in user
        this.setState({ serviceFiles: res.docs.map(_doc => _doc.data()) });
      });
    await firebase
      .firestore()
      .collection("files")
      .where("positions", "array-contains", this.props.position)
      .onSnapshot(async res => {
        //Retrieves all files related to the position of the logged-in user
        this.setState({ positionFiles: res.docs.map(_doc => _doc.data()) });
      });
  };

  //Render method of Document component
  render() {
    const { classes } = this.props;
    return (
      <div>
        {
          //If the logged-in user is an admin, then he can import files
          this.props.isAdmin && <DocumentImportComponent />
        }
        <div className={classes.center}>
          {/* The component for displaying files in a table is called twice, the first time sending service files
           as a parameter and the second time sending position files as a parameter. */}
          <Typography
            variant="h5"
            className={this.props.isAdmin ? classes.typo : classes.firstTypo}
          >
            Service : {this.props.service}
          </Typography>
          <DocumentTableComponent files={this.state.serviceFiles} />
          <Typography variant="h5" className={classes.typo}>
            Position : {this.props.position}
          </Typography>
          <div className={classes.positionComponent}>
            <DocumentTableComponent files={this.state.positionFiles} />
          </div>
        </div>
      </div>
    );
  }
}

//export the component with his styles
export default withStyles(styles)(DocumentComponent);
