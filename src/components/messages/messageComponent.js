import React from "react";
import NewMessage from "./newMessage";
import MessageList from "./messageList";
import MessageView from "./messageView";
import MessageTextBox from "./messageTextBox";
import styles from "../../styles/messages/messageComponentStyle";
import { Button, withStyles } from "@material-ui/core";
import firebase from "firebase";

// I need to investigate why sometimes
// two messages will send instead of just
// one. I dont know if there are two instances
// of the chat box component or what...

// I will be using both .then and async/await
// in this tutorial to give a feel of both.

class MessageComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedChat: null,
      newChatFormVisible: false,
      email: null,
      friends: [],
      chats: [],
    };
  }

  render() {
    if (this.state.email) {
      return (
        <div className="dashboard-container" id="dashboard-container">
          <MessageList
            history={this.props.history}
            userEmail={this.state.email}
            selectChatFn={this.selectChat}
            chats={this.state.chats}
            selectedChatIndex={this.state.selectedChat}
            newChatBtnFn={this.newChatBtnClicked}
          ></MessageList>
          {this.state.newChatFormVisible ? null : (
            <MessageView
              user={this.state.email}
              chat={this.state.chats[this.state.selectedChat]}
            ></MessageView>
          )}
          {this.state.selectedChat !== null &&
            !this.state.newChatFormVisible ? (
              <MessageTextBox
                userClickedInputFn={this.messageRead}
                submitMessageFn={this.submitMessage}
              ></MessageTextBox>
            ) : null}
          {this.state.newChatFormVisible ? (
            <NewMessage
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

  submitMessage = msg => {
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
  };

  //   // Always in alphabetical order:
  //   // 'user1:user2'
  buildDocKey = friend => [this.state.email, friend].sort().join(":");

  newChatBtnClicked = () =>
    this.setState({ newChatFormVisible: true, selectedChat: null });

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
          },
        ],
        users: [this.state.email, chatObj.sendTo],
        receiverHasRead: false,
      });
    this.setState({ newChatFormVisible: false });
    this.selectChat(this.state.chats.length - 1);
  };

  selectChat = async chatIndex => {
    await this.setState({ selectedChat: chatIndex, newChatFormVisible: false });
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
      }
    });
  };
}

export default withStyles(styles)(MessageComponent);
