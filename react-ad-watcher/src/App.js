import React, { useEffect } from "react";
import Login from "./components/Login/Login";
import "./App.css";
import Signup from "./components/Signup/Signup";
import Welcome from "./components/Welcome/Welcome";
import CreatePost from "./components/CreatePost/CreatePost";
import useLocalStorage from "./hooks/useLocalStorage";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

function App() {
  const [loggedIn, setLoggedIn] = useLocalStorage(
    "loggedIn",
    JSON.stringify(false)
  );
  const [signUpCall, setSignUpCall] = useLocalStorage(
    "signUpCall",
    JSON.stringify(false)
  );
  const [authToken, setAuth] = useLocalStorage("authToken", JSON.stringify(""));

  useEffect(() => {
    if (authToken === "") {
      Redirect("/login");
    } else {
      Redirect("/home");
    }
  }, [authToken]);
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Welcome
            authToken={authToken}
            setAuth={setAuth}
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
            signUpCall={signUpCall}
            setSignUpCall={setSignUpCall}
          ></Welcome>
        </Route>

        <Route path="/home" exact>
          <Welcome
            authToken={authToken}
            setAuth={setAuth}
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
            signUpCall={signUpCall}
            setSignUpCall={setSignUpCall}
          ></Welcome>
        </Route>
        <Route exact path="/login">
          <Login
            authToken={authToken}
            setAuth={setAuth}
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
            signUpCall={signUpCall}
            setSignUpCall={setSignUpCall}
          ></Login>
        </Route>

        <Route path="/signup" exact>
          <Signup
            authToken={authToken}
            setAuth={setAuth}
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
            signUpCall={signUpCall}
            setSignUpCall={setSignUpCall}
          />
        </Route>
        <Route path="/create-post" exact>
          <CreatePost authToken={authToken} setAuth={setAuth} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
