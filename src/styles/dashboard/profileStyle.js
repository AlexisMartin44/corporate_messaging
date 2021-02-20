const styles = theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginTop: "75px",
    height: "70vh",
  },
  rootToShow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: "20%",
    marginTop: "75px",
    height: "70vh",
    width: "70%",
  },
  card: {
    borderRadius: 12,
    textAlign: "center",
    minWidth: 500,
    marginRight: "15px"
  },
  secondCard: {
    borderRadius: 12,
    textAlign: "center",
    minWidth: 500,
    marginLeft: "15px",
  },
  cardHeader: {
    textAlign: "center",
    spacing: 10,
  },
  large: {
    width: theme.spacing(40),
    height: theme.spacing(40),
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
  }
});

export default styles;
