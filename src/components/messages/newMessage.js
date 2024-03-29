import React from "react";
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  Paper,
  withStyles,
  CssBaseline,
  Typography,
} from "@material-ui/core";
import styles from "../../styles/messages/newMessageStyle";
import firebase from "firebase";

/**
 * @classdesc Component to send a new message to someone to whom you have already sent messages or no messages at all
 * @class
 * @extends React.Component  */
class NewMessage extends React.Component {
  constructor() {
    super();
    //State that contains the message to send
    this.state = {
      message: null,
    };
  }

  /**
   * @desc Render method of NewMessageComponent
   * @function
   */
  render() {
    //Styles classes
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Typography
            style={{ textAlign: "center" }}
            component="h1"
            variant="h5"
          >
            Send a message to {this.props.user.firstName} !
          </Typography>
          <form className={classes.form} onSubmit={e => this.submitNewChat(e)}>
            <FormControl fullWidth>
              <InputLabel htmlFor="new-chat-message">
                Enter Your Message
              </InputLabel>
              <Input
                required
                className={classes.input}
                onChange={e => this.userTyping(e)}
                id="new-chat-message"
              ></Input>
            </FormControl>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              type="submit"
            >
              Send
            </Button>
          </form>
          {this.state.serverError ? (
            <Typography
              component="h5"
              variant="h6"
              className={classes.errorText}
            >
              Unable to locate the user
            </Typography>
          ) : null}
        </Paper>
      </main>
    );
  }

  /**
   * @function
   * @desc gets invoked right after a React component has been mounted, allows to update the state
   */
  componentDidMount() {
    if (!firebase.auth().currentUser) this.props.history.push("/login");
  }

  /**
   * @desc Updates the state when the user types his message
   * @param {*} e
   * @function
   */
  userTyping = e => {
    this.setState({ message: e.target.value });
  };

  /**
   * @desc Depending on whether you have already spoken to the person or not, refers to the existing discussion or to a new discussion
   * @param {*} e
   * @function
   */
  submitNewChat = async e => {
    e.preventDefault();
    const userExists = await this.userExists();
    if (userExists) {
      const chatExists = await this.chatExists();
      chatExists ? this.goToChat() : this.createChat();
    }
  };

  /**
   * @desc Creates a key for firebase queries
   * @function
   */
  buildDocKey = () =>
    [firebase.auth().currentUser.email, this.props.user.email].sort().join(":");

  /**
   * @desc Creates a new conversation with the entered message
   * @function
   */
  createChat = () => {
    this.props.newChatSubmitFn({
      sendTo: this.props.user.email,
      message: this.state.message,
    });
  };

  /**
   * @desc Refers to an existing conversation
   * @function
   */
  goToChat = () =>
    this.props.goToChatFn(this.buildDocKey(), this.state.message);

  /**
   * @desc Checks if a conversation already exists between the two users
   * @function
   */
  chatExists = async () => {
    const docKey = this.buildDocKey();
    const chat = await firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .get();
    return chat.exists;
  };

  /**
   * @desc Verifies that the user to whom you want to send a message exists (normally this is always the case)
   * @function
   */
  userExists = async () => {
    const usersSnapshot = await firebase.firestore().collection("users").get();
    const exists = usersSnapshot.docs
      .map(_doc => _doc.data().email)
      .includes(this.props.user.email);
    this.setState({ serverError: !exists });
    return exists;
  };
}

export default withStyles(styles)(NewMessage);
