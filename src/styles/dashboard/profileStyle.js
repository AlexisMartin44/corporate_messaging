const styles = theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginTop: "80px",
    height: "70vh",
    [theme.breakpoints.down('1050')]: {
      flexDirection: "column",
      justifyContent: "start",
      height: "120vh"
    },
    [theme.breakpoints.down('xs')]: {
      height: "110vh"
    },
  },
  rootToShow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "0px",
    right: 0,
    height: "98%",
    width: "80%",
    [theme.breakpoints.down('1300')]: {
      flexDirection: "column",
      justifyContent: "start",
    },
    [theme.breakpoints.down('1200')]: {
      top: "70px",
    },

  },
  card: {
    borderRadius: 12,
    textAlign: "center",
    minWidth: 500,
    marginRight: "15px",
    [theme.breakpoints.down('1050')]: {
      minWidth: 400,
      maxWidth: "100%",
      minHeight: 550,
      marginRight: 0,
    },
    [theme.breakpoints.down("xs")]: {
      minWidth: 287,
      minHeight: 275,
      width: "90%",
    },
  },
  cardToShow: {
    borderRadius: 12,
    textAlign: "center",
    minWidth: 500,
    marginRight: "15px",
    minHeight: 275,
    [theme.breakpoints.down("1300")]: {
      marginRight: 0,
      minWidth: 287,
      minHeight: 0,
      width: "90%",
    },
  },
  secondCard: {
    borderRadius: 12,
    textAlign: "center",
    minWidth: 500,
    marginLeft: "15px",
    [theme.breakpoints.down('1050')]: {
      minWidth: 400,
      minHeight: 275,
      marginTop: "5vh",
      marginLeft: 0,
    },
    [theme.breakpoints.down("xs")]: {
      minWidth: 287,
      minHeight: 275,
      width: "80%",
    },
  },
  secondCardToShow: {
    borderRadius: 12,
    textAlign: "center",
    marginLeft: "15px",
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0,
    },
  },
  secondCardContent: {
    padding: 0,
    paddingBottom: "0 !important",
  },
  cardHeader: {
    textAlign: "center",
    spacing: 10,
  },
  large: {
    width: theme.spacing(40),
    height: theme.spacing(40),
    [theme.breakpoints.down('xs')]: {
      width: theme.spacing(25),
      height: theme.spacing(25),
    },
  },
  largeToShow: {
    width: theme.spacing(40),
    height: theme.spacing(40),
    [theme.breakpoints.down("1300")]: {
      width: theme.spacing(20),
      height: theme.spacing(20),
    },
    [theme.breakpoints.down("1200")]: {
      width: theme.spacing(10),
      height: theme.spacing(10),
    },
  },
  input: {
    display: "none",
  },
  button: {
    background: "none",
    boxShadow: "none",
  },
  typo: {
    margin: "10px",
    marginTop: "20px",
    verticalAlign: "center",
  },
  typoToShow: {
    margin: "10px",
    marginTop: "20px",
    verticalAlign: "center",
    [theme.breakpoints.down("xs")]: {
      fontSize: "150%",
    },
  },
  element: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  typoElement: {
    width: "200px"
  },
  stats: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  marginLeft: {
    marginLeft: "10px"
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  sendIcon: {
    marginLeft: "10px",
  },
  secondPartToShow: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 500,
    [theme.breakpoints.down("1300")]: {
      marginTop: "10px",
      marginLeft: 0,
      minWidth: 287,
      minHeight: 275,
      width: "80%",
    },
  },
  secondPart: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 500,
    [theme.breakpoints.down("xs")]: {
      marginTop: "10px",
      marginLeft: 0,
      minWidth: 287,
      minHeight: 275,
      width: "80%",
    },
  },
  sendButton: {
    marginTop: "10px",
  }
});

export default styles;
