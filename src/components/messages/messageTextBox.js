import React from "react";
import TextField from "@material-ui/core/TextField";
import Send from "@material-ui/icons/Send";
import styles from "../../styles/messages/messageTextBoxStyle";
import { withStyles } from "@material-ui/core/styles";

/**
 * @classdesc Chat bar, allows to write a new message
 * @class
 * @extends React.Component  */
class MessageTextBox extends React.Component {
  constructor() {
    super();
    //State that contains the text of the new message
    this.state = {
      chatText: "",
    };
  }

  /**
   * @desc Render method of the MessageTextBoxComponent
   * @function
   */
  render() {
    //Styles classes
    const { classes } = this.props;

    return (
      <div className={classes.chatTextBoxContainer}>
        <TextField
          placeholder="Type your message.."
          onKeyUp={e => this.userTyping(e)}
          id="chattextbox"
          className={classes.chatTextBox}
          onFocus={this.userClickedInput}
        ></TextField>
        <Send onClick={this.submitMessage} className={classes.sendBtn}></Send>
      </div>
    );
  }

  /**
   * @desc Updates the state with the chat entered in the bar for each keystroke, and sends the message if the key is enter.
   * @param {*} e
   * @function
   */
  userTyping = e =>
    e.keyCode === 13 //enter
      ? this.submitMessage()
      : this.setState({ chatText: e.target.value });
  /**
   * @desc Check if the message is valid
   * @param {string} txt
   * @function
   */
  messageValid = txt => txt && txt.replace(/\s/g, "").length;
  /**
   * @desc Marks the conversation as read
   * @function
   */
  userClickedInput = () => this.props.userClickedInputFn();
  /**
   * @desc Calls the function to send a new message and empties the chat bar
   * @function
   */
  submitMessage = () => {
    if (this.messageValid(this.state.chatText)) {
      this.props.submitMessageFn(this.state.chatText);
      document.getElementById("chattextbox").value = "";
    }
  };
}

export default withStyles(styles)(MessageTextBox);
