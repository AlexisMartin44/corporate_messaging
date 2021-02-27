const styles = theme => ({
  main: {
    position: "absolute",
    top: 0,
    right: 0,
    height: "100%",
    width: "80%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  paper: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${
      theme.spacing.unit * 3
    }px`,
    width: "40%",
    [theme.breakpoints.down("900")]: {
      width: "80%",
    },
  },
  input: {},
  form: {
    width: "100%",
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});

export default styles;
