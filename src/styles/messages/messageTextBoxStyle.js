const styles = theme => ({
  sendBtn: {
    color: "blue",
    cursor: "pointer",
    "&:hover": {
      color: "gray",
    },
  },
  chatTextBoxContainer: {
    position: "relative",
    bottom: "40px",
    left: "20%",
    boxSizing: "border-box",
    overflow: "auto",
    width: "80%",
    display: "flex",
    justifyContent: "center",
  },

  chatTextBox: {
    width: "calc(100% - 20%)",
  },
});

export default styles;
