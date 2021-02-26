import React from "react";
import NewMessage from "./newMessage";
import MessageList from "./messageList";
import MessageView from "./messageView";
import MessageTextBox from "./messageTextBox";
import styles from "../../styles/messages/messageComponentStyle";
import { Button, withStyles } from "@material-ui/core";
import firebase from "firebase";
import ProfileComponent from "../dashboard/profile";

class MessageComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      filterDate: false,
      selectedChat: null,
      newChatFormVisible: false,
      email: null,
      friends: [],
      chats: [],
      users: [],
      userVisible: false,
      userToShow: null,
    };
  }

  setUserToShow = async (user) => {
    await this.setState({ userToShow: user, userVisible: true, newChatFormVisible: false, selectedChat: null });
  }

  changeFilter = () => {
    if (this.state.filterDate == true)
      this.setState({ filterDate: false });
    else
      this.setState({ filterDate: true });
  }

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
          {this.state.newChatFormVisible == true || this.state.userVisible == true ? null : this.state.selectedChat != null ?
            (
              <MessageView
                user={this.state.email}
                chat={this.state.chats[this.state.selectedChat]}
              ></MessageView>
            ) : null}
          {
            this.state.userVisible ? (<ProfileComponent newChatBtnFn={this.newChatBtnClicked} setUserToShow={this.setUserToShow} toShow={true} userData={this.state.userToShow} />) : null
          }
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

  //signOut = () => firebase.auth().signOut();

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
    if (this.state.filterDate)
      await this.setState({ selectedChat: 0 });
  };

  //   // Always in alphabetical order:
  //   // 'user1:user2'
  buildDocKey = friend => [this.state.email, friend].sort().join(":");

  newChatBtnClicked = () =>
    this.setState({ newChatFormVisible: true, selectedChat: null, userVisible: false });

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
    if (this.state.filterDate == true)
      this.selectChat(0);
  };

  selectChat = async chatIndex => {
    await this.setState({ selectedChat: chatIndex, newChatFormVisible: false, userVisible: false, userToShow: null });
    this.messageRead();
  };

  goToChat = async (docKey, msg) => {
    const usersInChat = docKey.split(":");
    const chat = this.state.chats.find(_chat =>
      usersInChat.every(_user => _chat.users.includes(_user))
    );
    this.setState({ newChatFormVisible: false });
    await this.selectChat(this.state.chats.indexOf(chat));
    this.submitMessage(msg);
  };

  //   // Chat index could be different than the one we are currently on in the case
  //   // that we are calling this function from within a loop such as the chatList.
  //   // So we will set a default value and can overwrite it when necessary.
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

  clickedMessageWhereNotSender = chatIndex =>
    this.state.chats[chatIndex].messages[
      this.state.chats[chatIndex].messages.length - 1
    ].sender !== this.state.email;

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
}

export default withStyles(styles)(MessageComponent);
