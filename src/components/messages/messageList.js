import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  Button,
  ListItemIcon,
  AppBar,
  Toolbar,
  TextField
} from "@material-ui/core";
import styles from "../../styles/messages/messageListStyle";
import NotificationImportant from "@material-ui/icons/NotificationImportant";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { UserComponent } from "./userSearch";

class MessageList extends React.Component {

  constructor() {
    super();
    this.state = {
      searchValue: "",
      userToShow: null,
    };
  }

  filterOptions = createFilterOptions({
    matchFrom: "any",
    stringify: (option) => option.firstName + " " + option.lastName + " " + option.service + " " + option.position,
  });

  setUserToShow = (user) => {
    this.props.setUserToShow(user);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar className={classes.toolbar}>
            <Autocomplete
              className={classes.autocomplete}
              freeSolo
              id="filter-demo"
              options={this.props.users.filter(user => user.email != this.props.userEmail)}
              filterOptions={this.filterOptions}
              style={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Search" />
              )}
              renderOption={(option) => (
                <UserComponent newChat={this.newChat} user={option} setUserToShow={this.setUserToShow} />
              )}
            />
          </Toolbar>
        </AppBar>

        {this.props.chats.length > 0 ? <List>
          {this.props.chats.map((_chat, _index) => {
            return (
              <div key={_index}>
                <ListItem
                  onClick={() => this.selectChat(_index)}
                  className={classes.listItem}
                  selected={this.props.selectedChatIndex === _index}
                  alignItems="flex-start"
                >
                  <ListItemAvatar>
                    <Avatar src={this.props.users.length > 0 ? this.props.users.filter(user => user.email == _chat.users.filter(_user => _user !== this.props.userEmail)[0])[0].image : ""}>
                      {
                        _chat.users
                          .filter(_user => _user !== this.props.userEmail)[0]
                          .split("")[0]
                          .toUpperCase()
                      }
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      _chat.users.filter(
                        _user => _user !== this.props.userEmail
                      )[0]
                    }
                    secondary={
                      <React.Fragment>
                        <Typography component="span" color="textPrimary">
                          {_chat.messages[
                            _chat.messages.length - 1
                          ].message.substring(0, 30) + " ..."}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  {_chat.receiverHasRead === false &&
                    !this.userIsSender(_chat) ? (
                      <ListItemIcon>
                        <NotificationImportant
                          className={classes.unreadMessage}
                        ></NotificationImportant>
                      </ListItemIcon>
                    ) : null}
                </ListItem>
                <Divider />
              </div>
            );
          })}
        </List> : null}

      </div>
    );

  }
  userIsSender = chat =>
    chat.messages[chat.messages.length - 1].sender === this.props.userEmail;
  newChat = () => this.props.newChatBtnFn();
  selectChat = index => this.props.selectChatFn(index);

  handleChange = event => {
    this.setState({ searchValue: event.target.value });
  };
}

export default withStyles(styles)(MessageList);
