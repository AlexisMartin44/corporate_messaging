const styles = theme => ({
  sendBtn: {
    color: "blue",
    cursor: "pointer",
    "&:hover": {
      color: "gray",
    },
  },
  chatTextBoxContainer: {
    position: "absolute",
    bottom: "90px",
    left: "400px",
    boxSizing: "border-box",
    overflow: "auto",
    width: "calc(100% - 500px)",
  },

  chatTextBox: {
    width: "calc(100% - 25px)",
  },
});

export default styles;
