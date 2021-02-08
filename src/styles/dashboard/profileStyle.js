const styles = theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    position: "relative",
    marginTop: "100px",
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
});

export default styles;
