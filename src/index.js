import React from "react";
import ReactDOM from "react-dom";
import { Route, BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import reportWebVitals from "./reportWebVitals";
import firebase from "firebase";
import RegisterComponent from "./components/login&register/register";
import LoginComponent from "./components/login&register/login";
import MessageComponent from "./components/messages/messageComponent";
import DashboardComponent from "./components/dashboard/dashboard";

require("firebase/firestore"); // Required for side-effects?????

firebase.initializeApp({
  apiKey: "AIzaSyA4q3i0kbwLYXW2S-KsMJ0-cEkSHVaTF2o",
  authDomain: "msg-instant.firebaseapp.com",
  projectId: "msg-instant",
  storageBucket: "msg-instant.appspot.com",
  messagingSenderId: "976711450876",
  appId: "1:976711450876:web:50d83274697fad10e5d779",
  measurementId: "G-DTGBYTYQJG",
});



const routing = (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Route path="/login" component={LoginComponent}></Route>
      <Route path="/register" component={RegisterComponent}></Route>
      <Route path="/dashboard" component={DashboardComponent}></Route>
      <Route path="/messages" component={MessageComponent}></Route>
    </BrowserRouter>
  </ThemeProvider>
);

ReactDOM.render(routing, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
