
const styles = theme => ({
  root: {
    position: "absolute",
    top: 0,
    right: 0,
    height: "100%",
    width: "80%",
    [theme.breakpoints.down("1200")]: {
      top: "64px",
      height: "calc(100% - 70px)",
    },
    [theme.breakpoints.down("xs")]: {
      top: "56px",
    },
  },
  content: {
    height: "calc(94% - 50px)",
    marginTop: "50px",
    overflow: "auto",
    padding: "25px",
    paddingTop: "5px",
    boxSizing: "border-box",
    overflowY: "scroll",
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      marginTop: "60px",
      height: "calc(94% - 60px)",
    },
  },

  userSent: {
    fontFamily: "sans-serif",
    float: "left",
    clear: "both",
    padding: "20px",
    boxSizing: "border-box",
    wordWrap: "break-word",
    marginTop: "10px",
    backgroundColor: "#707BC4",
    color: "white",
    width: "30%",
    borderRadius: "10px",
    [theme.breakpoints.down("1000")]: {
      width: "60%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "90%",
    },
  },

  friendSent: {
    fontFamily: "sans-serif",
    float: "right",
    clear: "both",
    padding: "20px",
    boxSizing: "border-box",
    wordWrap: "break-word",
    marginTop: "10px",
    backgroundColor: "#9e9e9e",
    color: "white",
    width: "30%",
    borderRadius: "10px",
    [theme.breakpoints.down("1000")]: {
      width: "60%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "90%",
    },
  },

  chatHeader: {
    width: "80%",
    height: "50px",
    backgroundColor: "#344195",
    position: "fixed",
    fontSize: "18px",
    textAlign: "center",
    color: "white",
    paddingTop: "10px",
    boxSizing: "border-box",
    [theme.breakpoints.down("xs")]: {
      height: "60px",
    },
  },
});

export default styles;
