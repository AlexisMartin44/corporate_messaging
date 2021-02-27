import { fade } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    height: "100%",
    width: "20%",
    boxShadow: "0px 0px 1px black",
  },
  listItem: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      justifyContent: "center",
    },
  },
  itemText: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  typoPrimary: {
    fontWeight: "450",
    fontSize: "1vw",
    [theme.breakpoints.down("1200")]: {
      fontSize: "0.75vw",
    },
  },
  typoSecondary: {
    fontSize: "1vw",
    [theme.breakpoints.down("1200")]: {
      fontSize: "0.75vw",
    },
  },
  unreadMessage: {
    color: "red",
    position: "absolute",
    top: "0",
    right: "5px",
  },
  toolbar: {
    padding: 0,
    paddingRight: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    [theme.breakpoints.down("1200")]: {
      padding: 0,
    },
  },
  appbar: {
    [theme.breakpoints.down("1200")]: {
      width: "500%",
    },
  },
  autocomplete: {
    width: "80%",
  },
});

export default styles;
