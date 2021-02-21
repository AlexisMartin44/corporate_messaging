const styles = theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    position: "relative",
    marginTop: "100px",
    "& > *": {
      margin: theme.spacing(1),
    },
    [theme.breakpoints.down('xs')]: {
      alignItems: "center",
      flexDirection: "column",
    },
  },
  input: {
    display: "none",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 180,
    maxWidth: 300,
    [theme.breakpoints.down('xs')]: {
      width: "100%"
    },
  },
});

export default styles;
