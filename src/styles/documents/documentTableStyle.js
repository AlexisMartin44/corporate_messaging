const styles = theme => ({
  centerRoot: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
  },
  root: {
    display: "flex",
    width: "50%",
    justifyContent: "center",
    [theme.breakpoints.down('xs')]: {
      width: "100%"
    },
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  tableLabel: {
    paddingLeft: "20px",
  },
});

export default styles;
