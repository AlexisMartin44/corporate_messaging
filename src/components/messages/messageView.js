import React from "react";
import styles from "../../styles/messages/messageViewStyle";
import { withStyles } from "@material-ui/core/styles";

/**
 * @classdesc Conversation message display component
 * @class
 * @extends React.Component  */
class MessageView extends React.Component {
  /**
   * @desc When loading, scroll at the bottom of the page to display the last messages
   * @function
   */
  componentDidMount = () => {
    const container = document.getElementById("chatview-container");
    if (container) container.scrollTo(0, container.scrollHeight);
  };
  /**
   * @desc When messages are sent, scroll to the bottom of the page
   * @function
   */
  componentDidUpdate = () => {
    const container = document.getElementById("chatview-container");
    if (container) container.scrollTo(0, container.scrollHeight);
  };

  /**
   * @desc Render method of MessageViewComponent
   * @function
   */
  render() {
    //Styles classes
    const { classes } = this.props;

    if (this.props.chat === undefined) {
      return <main className={classes.content}></main>;
    } else if (this.props.chat !== undefined) {
      return (
        <div className={classes.root}>
          {/* Header that displays the user you are talking to */}
          <div className={classes.chatHeader}>
            Your conversation with
            {" " +
              this.props.friend.firstName +
              " " +
              this.props.friend.lastName}
          </div>
          <main id="chatview-container" className={classes.content}>
            {this.props.chat.messages.map((_msg, _index) => {
              return (
                <div
                  key={_index}
                  className={
                    _msg.sender === this.props.user
                      ? classes.userSent
                      : classes.friendSent
                  }
                >
                  {_msg.message}
                </div>
              );
            })}
          </main>
        </div>
      );
    } else {
      return <div className="chatview-container">Loading...</div>;
    }
  }
}

export default withStyles(styles)(MessageView);
