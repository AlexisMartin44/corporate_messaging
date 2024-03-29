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
  ListItemIcon,
  AppBar,
  Toolbar,
  TextField,
  IconButton,
} from "@material-ui/core";
import styles from "../../styles/messages/messageListStyle";
import NotificationImportant from "@material-ui/icons/NotificationImportant";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { UserComponent } from "./userSearch";
import EventIcon from "@material-ui/icons/Event";
import SortByAlphaIcon from "@material-ui/icons/SortByAlpha";

/**
 * @classdesc List component of messages from the logged-in user with searchbar
 * @class
 * @extends React.Component  */
class MessageList extends React.Component {
  /**
   * @desc Define the filter method to display the corresponding items in the search bar
   * @function
   */
  filterOptions = createFilterOptions({
    matchFrom: "any",
    stringify: option =>
      option.firstName +
      " " +
      option.lastName +
      " " +
      option.service +
      " " +
      option.position,
  });

  /**
   * @desc Allows to display a user's profile
   * @param {Object} user - User whose profile you wish to view
   * @function
   */
  setUserToShow = user => {
    this.props.setUserToShow(user);
  };

  /**
   * @desc Changes the sorting of messages, by date or name
   * @function
   */
  handleIconClick = () => {
    this.props.changeFilter();
  };

  /**
   * @desc Render method of MessageListComponent
   * @function
   */
  render() {
    //Styles classes
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        {/* Searchbar */}
        <AppBar position="static" className={classes.appbar}>
          <Toolbar className={classes.toolbar}>
            {/* The element that allows to search users */}
            <Autocomplete
              className={classes.autocomplete}
              freeSolo
              id="filter-demo"
              //Items to be filtered, so all users except the user currently logged in
              options={this.props.users.filter(
                user => user.email != this.props.userEmail
              )}
              filterOptions={this.filterOptions}
              style={{ color: "white !important" }}
              renderInput={params => <TextField {...params} label="Search" />}
              getOptionLabel={option => ""}
              //How the results will be displayed
              renderOption={option => (
                <UserComponent
                  newChat={this.newChat}
                  user={option}
                  setUserToShow={this.setUserToShow}
                />
              )}
            />
            <IconButton onClick={this.handleIconClick} component="span">
              {this.props.filterDate ? <SortByAlphaIcon /> : <EventIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Display of all user conversations */}
        {this.props.chats.length > 0 ? (
          <List>
            {this.props.chats
              .sort((a, b) => {
                //Sorting by date or name
                if (this.props.filterDate == true)
                  return (
                    b.messages[b.messages.length - 1].timestamp -
                    a.messages[a.messages.length - 1].timestamp
                  );

                return a.users
                  .filter(_user => _user !== this.props.userEmail)[0]
                  .localeCompare(
                    b.users.filter(_user => _user !== this.props.userEmail)[0]
                  );
              })
              .map((_chat, _index) => {
                //For each conversation
                return (
                  <div key={_index}>
                    <ListItem
                      onClick={() => this.selectChat(_index)}
                      className={classes.listItem}
                      selected={this.props.selectedChatIndex === _index}
                      alignItems="flex-start"
                    >
                      <ListItemAvatar
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          margin: 0,
                        }}
                      >
                        <Avatar
                          src={
                            //Load profile image
                            this.props.users.length > 1
                              ? this.props.users.filter(
                                  user =>
                                    user.email ==
                                    _chat.users.filter(
                                      _user => _user !== this.props.userEmail
                                    )[0]
                                )[0].image
                              : ""
                          }
                        >
                          {
                            //Else it will be the first letter of the mail
                            _chat.users
                              .filter(
                                _user => _user !== this.props.userEmail
                              )[0]
                              .split("")[0]
                              .toUpperCase()
                          }
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        className={classes.itemText}
                        primary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              color="textPrimary"
                              className={classes.typoPrimary}
                            >
                              {
                                _chat.users.filter(
                                  _user => _user !== this.props.userEmail
                                )[0]
                              }
                            </Typography>
                          </React.Fragment>
                        }
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              color="textPrimary"
                              className={classes.typoSecondary}
                            >
                              {
                                //Text is cut off if too long
                                _chat.messages[
                                  _chat.messages.length - 1
                                ].message.substring(0, 30) + " ..."
                              }
                            </Typography>
                          </React.Fragment>
                        }
                      />
                      {
                        //If the conversation has not been read, a notification icon is displayed
                        _chat.receiverHasRead === false &&
                        !this.userIsSender(_chat) ? (
                          <ListItemIcon>
                            <NotificationImportant
                              className={classes.unreadMessage}
                            ></NotificationImportant>
                          </ListItemIcon>
                        ) : null
                      }
                    </ListItem>
                    {/* Line between conversations */}
                    <Divider />
                  </div>
                );
              })}
          </List>
        ) : null}
      </div>
    );
  }
  /**
   * @desc Check if the last message has been sent by the logged-in user
   * @param {Object} chat - The conversation
   * @function
   */
  userIsSender = chat =>
    chat.messages[chat.messages.length - 1].sender === this.props.userEmail;

  /**
   * @desc Launches the new message function
   * @function
   */
  newChat = () => this.props.newChatBtnFn();

  /**
   * @desc Select a new chat
   * @param {number} index - Index of the new selected chat
   * @function
   */
  selectChat = index => this.props.selectChatFn(index);
}

export default withStyles(styles)(MessageList);
