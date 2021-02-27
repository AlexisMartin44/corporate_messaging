import React from "react";
import styles from "../../styles/messages/messageViewStyle";
import { withStyles } from "@material-ui/core/styles";

class MessageView extends React.Component {
  componentDidMount = () => {
    const container = document.getElementById("chatview-container");
    if (container) container.scrollTo(0, container.scrollHeight);
  };
  componentDidUpdate = () => {
    const container = document.getElementById("chatview-container");
    if (container) container.scrollTo(0, container.scrollHeight);
  };

  render() {
    const { classes } = this.props;
    console.log(this.props.friend);

    if (this.props.chat === undefined) {
      return <main className={classes.content}></main>;
    } else if (this.props.chat !== undefined) {
      return (
        <div className={classes.root}>
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
