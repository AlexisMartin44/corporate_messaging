import { fade } from '@material-ui/core/styles';

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
    justifyContent: "flex-end",
  },
  autocomplete: {
    maxWidth: "270px",
  }
});

export default styles;
