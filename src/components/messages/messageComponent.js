import React from "react";
import NewMessage from "./newMessage";
import MessageList from "./messageList";
import MessageView from "./messageView";
import MessageTextBox from "./messageTextBox";
import styles from "../../styles/messages/messageComponentStyle";
import { withStyles } from "@material-ui/core";
import firebase from "firebase";
import ProfileComponent from "../dashboard/profile";

/**
 * @classdesc Main component of message functionnality, mother component of the other message components
 * @class
 * @extends React.Component  */
class MessageComponent extends React.Component {
  constructor() {
    super();
    //State that contains the selected chat, if a new message will be send, if messages are sort by date or name, email of the current
    //logged-in user, all messages from the logged-in user, all users, and variables to show an user profile
    this.state = {
      filterDate: false,
      selectedChat: null,
      newChatFormVisible: false,
      email: null,
      chats: [],
      users: [],
      userVisible: false,
      userToShow: null,
    };
  }

  /**
   * @desc Update the state in order to make it possible to display a profile
   * @param {Object} user - User to display
   * @function
   */
  setUserToShow = async user => {
    await this.setState({
      userToShow: user,
      userVisible: true,
      newChatFormVisible: false,
      selectedChat: null,
    });
  };

  /**
   * @desc Changes the type of message sorting
   * @function
   */
  changeFilter = () => {
    if (this.state.filterDate == true) this.setState({ filterDate: false });
    else this.setState({ filterDate: true });
  };

  /**
   * @desc Render method of MessageComponent
   * @function
   */
  render() {
    const { classes } = this.props;
    if (this.state.email) {
      return (
        <div className={classes.root} id="dashboard-container">
          <MessageList
            changeFilter={this.changeFilter}
            filterDate={this.state.filterDate}
            users={this.state.users}
            history={this.props.history}
            userEmail={this.state.email}
            selectChatFn={this.selectChat}
            chats={this.state.chats}
            selectedChatIndex={this.state.selectedChat}
            newChatBtnFn={this.newChatBtnClicked}
            setUserToShow={this.setUserToShow}
          ></MessageList>
          {this.state.newChatFormVisible == true ||
          this.state.userVisible == true ? null : this.state.selectedChat !=
            null ? (
            <MessageView
              user={this.state.email}
              friend={
                this.state.users.filter(
                  user =>
                    user.email ==
                    this.state.chats[this.state.selectedChat].users.filter(
                      _usr => _usr !== this.state.email
                    )[0]
                )[0]
              }
              chat={this.state.chats[this.state.selectedChat]}
            ></MessageView>
          ) : null}
          {this.state.userVisible ? (
            <ProfileComponent
              newChatBtnFn={this.newChatBtnClicked}
              setUserToShow={this.setUserToShow}
              toShow={true}
              userData={this.state.userToShow}
            />
          ) : null}
          {this.state.selectedChat !== null &&
          !this.state.newChatFormVisible ? (
            <MessageTextBox
              userClickedInputFn={this.messageRead}
              submitMessageFn={this.submitMessage}
            ></MessageTextBox>
          ) : null}
          {this.state.newChatFormVisible ? (
            <NewMessage
              user={this.state.userToShow}
              goToChatFn={this.goToChat}
              newChatSubmitFn={this.newChatSubmit}
            ></NewMessage>
          ) : null}
        </div>
      );
    } else {
      return <div>LOADING....</div>;
    }
  }

  /**
   * @desc Sends a message by adding it to the database
   * @param {string} msg - Message to submit
   * @function
   */
  submitMessage = async msg => {
    const docKey = this.buildDocKey(
      this.state.chats[this.state.selectedChat].users.filter(
        _usr => _usr !== this.state.email
      )[0]
    );
    firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          sender: this.state.email,
          message: msg,
          timestamp: Date.now(),
        }),
        receiverHasRead: false,
      });
    if (this.state.filterDate) await this.setState({ selectedChat: 0 });
  };

  /**
   * @desc Generates a firebase key for the collection
   * @param {string} friend - User to whom the logged-in user sends the message
   * @function
   */
  buildDocKey = friend => [this.state.email, friend].sort().join(":");

  /**
   * @desc Allows to display the newMessageComponent when a logged-in user asks to send a message to a user so he consults the profile
   * @function
   */
  newChatBtnClicked = () =>
    this.setState({
      newChatFormVisible: true,
      selectedChat: null,
      userVisible: false,
    });

  /**
   * @desc Creates a new conversation (if a conversation between the two does not already exist) and sends as first message the object in parameter
   * @param {Object} chatObj - Object that contains the user to whom to send a message and the message
   * @function
   */
  newChatSubmit = async chatObj => {
    const docKey = this.buildDocKey(chatObj.sendTo);
    await firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .set({
        messages: [
          {
            message: chatObj.message,
            sender: this.state.email,
            timestamp: Date.now(),
          },
        ],
        users: [this.state.email, chatObj.sendTo],
        receiverHasRead: false,
      });
    this.setState({ newChatFormVisible: false });
    if (this.state.filterDate == true) this.selectChat(0);
  };

  /**
   * @desc Allows you to select a chat, therefore to refresh the ViewComponent message in order to display the right conversation
   * @param {number} chatIndex - Index of the selected chat
   * @function
   */
  selectChat = async chatIndex => {
    await this.setState({
      selectedChat: chatIndex,
      newChatFormVisible: false,
      userVisible: false,
      userToShow: null,
    });
    //set the conversation as read
    this.messageRead();
  };

  /**
   * @desc Allows you to display a conversation with the new message sent from the newMessageComponent
   * if you use it to send a message you already have a conversation with.
   * @param {string} docKey - Contains the emails of the two users of the conversation separated by a :
   * @param {string} msg
   * @function
   */
  goToChat = async (docKey, msg) => {
    const usersInChat = docKey.split(":");
    const chat = this.state.chats.find(_chat =>
      usersInChat.every(_user => _chat.users.includes(_user))
    );
    this.setState({ newChatFormVisible: false });
    await this.selectChat(this.state.chats.indexOf(chat));
    this.submitMessage(msg);
  };

  /**
   * @desc Set the conversation as read
   * @function
   */
  messageRead = () => {
    const chatIndex = this.state.selectedChat;
    const docKey = this.buildDocKey(
      this.state.chats[chatIndex].users.filter(
        _usr => _usr !== this.state.email
      )[0]
    );
    if (this.clickedMessageWhereNotSender(chatIndex)) {
      firebase
        .firestore()
        .collection("chats")
        .doc(docKey)
        .update({ receiverHasRead: true });
    }
  };

  /**
   * @desc Changes the state of the conversation if you are the receiver
   * @param {number} chatIndex
   */
  clickedMessageWhereNotSender = chatIndex =>
    this.state.chats[chatIndex].messages[
      this.state.chats[chatIndex].messages.length - 1
    ].sender !== this.state.email;

  /**
   * @function
   * @desc gets invoked right after a React component has been mounted, allows to update the state
   */
  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(async _usr => {
      if (_usr) {
        await firebase
          .firestore()
          .collection("chats")
          .where("users", "array-contains", _usr.email)
          .onSnapshot(async res => {
            const chats = res.docs.map(_doc => _doc.data());
            await this.setState({
              user: _usr,
              email: _usr.email,
              chats: chats,
              friends: [],
            });
          });

        await firebase
          .firestore()
          .collection("users")
          .onSnapshot(async res => {
            const users = res.docs.map(_doc => _doc.data());
            await this.setState({
              users: users,
            });
          });
      }
    });
  };

  /**
   * @desc fix warning: Can't perform a React state update on an unmounted component
   * @function
   */
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
}

export default withStyles(styles)(MessageComponent);
