import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import ChatIcon from "@material-ui/icons/Chat";
import { Row, Item } from "@mui-treasury/components/flex";
import { Info, InfoTitle, InfoSubtitle } from "@mui-treasury/components/info";
import { useTutorInfoStyles } from "@mui-treasury/styles/info/tutor";
import { useSizedIconButtonStyles } from "@mui-treasury/styles/iconButton/sized";
import { useDynamicAvatarStyles } from "@mui-treasury/styles/avatar/dynamic";

const useStyles = makeStyles(theme => ({
  action: {
    backgroundColor: "#fff",
    boxShadow: "0 1px 4px 0 rgba(0,0,0,0.12)",
    "&:hover": {
      backgroundColor: "#fff",
      color: "#000",
    },
  },
  row: {
    [theme.breakpoints.down("xs")]: {
      minWidth: "98%",
    },
    minWidth: "50%",
    margin: "auto",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  info: {
    maxWidth: "100px",
    [theme.breakpoints.up("1200")]: {
      maxWidth: "3vw",
    },
  },
  infoTitle: {
    [theme.breakpoints.up("1200")]: {
      fontSize: "0.75vw",
    },
  },
  infoSub: {
    [theme.breakpoints.up("1200")]: {
      fontSize: "0.5vw",
    },
  },
}));

/**
 * @desc Allows to display the desired user profile
 * @param {Object} props - Props of the component
 * @function
 */
const handleClick = props => {
  props.setUserToShow(props.user);
};

/**
 * @desc Launches the newMessageComponent directly without consulting the profile
 * @param {Object} props - Props of the component
 * @function
 */
const newMessage = props => {
  props.setUserToShow(props.user);
  props.newChat();
};

/**
 * @desc Component entirely found in material-ui, nice user presentation box
 * @function
 */
export const UserComponent = React.memo(function TutorCard(props) {
  const styles = useStyles();
  const iconBtnStyles = useSizedIconButtonStyles({ padding: 8 });
  const avatarStyles = useDynamicAvatarStyles(theme => ({
    radius: 12,
    [theme.breakpoints.up("1200")]: {
      size: "3vw",
    },
  }));
  return (
    // Line
    <Row
      p={0.5}
      gap={2}
      bgcolor={"#f5f5f5"}
      borderRadius={16}
      className={styles.row}
    >
      {/* First item, the avatar profile */}
      <Item onClick={handleClick.bind(this, props)}>
        <Avatar classes={avatarStyles} src={props.user.image} />
      </Item>
      {/* User data */}
      <Info
        onClick={handleClick.bind(this, props)}
        position={"middle"}
        className={styles.info}
        useStyles={useTutorInfoStyles}
      >
        <InfoTitle className={styles.infoTitle}>
          {props.user.firstName} {props.user.lastName}
        </InfoTitle>
        <InfoSubtitle className={styles.infoSub}>
          {props.user.service}
        </InfoSubtitle>
        <InfoSubtitle className={styles.infoSub}>
          {props.user.position}
        </InfoSubtitle>
      </Info>
      {/* Icon button that allows to directly send a message */}
      <Item
        onClick={newMessage.bind(this, props)}
        className={styles.button}
        position={"middle"}
      >
        <IconButton className={styles.action} classes={iconBtnStyles}>
          <ChatIcon />
        </IconButton>
      </Item>
    </Row>
  );
});
