import React from "react";
import ReactDOM from "react-dom";
import { Route, BrowserRouter, Redirect } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import reportWebVitals from "./reportWebVitals";
import firebase from "firebase";
import RegisterComponent from "./components/login&register/register";
import LoginComponent from "./components/login&register/login";
import MessageComponent from "./components/messages/messageComponent";
import DashboardComponent from "./components/dashboard/dashboard";

require("firebase/firestore");

firebase.initializeApp({
  --Private data
});

const routing = (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      {/* <Route path="/">{<Redirect to="/login" />}</Route> */}
      <Route path="/login" component={LoginComponent}></Route>
      <Route path="/register" component={RegisterComponent}></Route>
      <Route path="/dashboard" component={DashboardComponent}></Route>
    </BrowserRouter>
  </ThemeProvider>
);

ReactDOM.render(routing, document.getElementById("root"));

reportWebVitals();
