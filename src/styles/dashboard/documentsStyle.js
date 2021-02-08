const styles = theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    position: "relative",
    marginTop: "100px",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
});

export default styles;
