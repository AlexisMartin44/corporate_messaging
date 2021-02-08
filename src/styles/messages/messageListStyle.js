const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    height: "calc(100% - 139px)",
    position: "absolute",
    top: "65px",
    left: "0",
    width: "300px",
    boxShadow: "0px 0px 1px black",
  },
  listItem: {
    cursor: "pointer",
  },
  newChatBtn: {
    borderRadius: "0px",
    height: "48px",
  },
  unreadMessage: {
    color: "red",
    position: "absolute",
    top: "0",
    right: "5px",
  },
});

export default styles;
