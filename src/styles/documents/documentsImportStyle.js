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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 180,
    maxWidth: 300,
  },
});

export default styles;
