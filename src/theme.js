import { createMuiTheme } from "@material-ui/core/styles";
import { red, blue } from "@material-ui/core/colors";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue[500],
    },
    secondary: {
      main: red[500],
    },
  },
  status: {
    danger: "orange",
  },
});

export default theme;
