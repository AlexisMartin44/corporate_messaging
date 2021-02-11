const styles = theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    position: "relative",
    marginTop: "100px",
    height: "80vh",
  },
  large: {
    width: theme.spacing(50),
    height: theme.spacing(50),
  },
  input: {
    display: "none",
  },
  button: {
    background: "none",
    boxShadow: "none",
  },
  paper: {
    display: "flex",
    justifyContent: "center",
    width: "40%",
    height: "80%",
  },
});

export default styles;
