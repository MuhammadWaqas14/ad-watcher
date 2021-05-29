import React, { useEffect } from "react";
import Login from "./components/Login/Login";
import "./App.css";
import Signup from "./components/Signup/Signup";
import Welcome from "./components/Welcome/Welcome";
import CreatePost from "./components/CreatePost/CreatePost";
import UpdatePost from "./components/UpdatePost/UpdatePost";
import ReportPost from "./components/ReportPost/ReportPost";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import NavBar from "./components/NavBar/NavBar";
import Wallet from "./components/Wallet/Wallet";
import BuyCredits from "./components/Wallet/BuyCredits";
import WithdrawCash from "./components/Wallet/WithdrawCash";
import WithdrawRequests from "./components/AdminPanel/WithdrawRequests";
import CreditRequests from "./components/AdminPanel/CreditRequests";
import ContentReports from "./components/AdminPanel/ContentReports";
import Users from "./components/AdminPanel/Users";
import NavBarUser from "./components/NavBarUser/NavBar";
import EmailConfirmed from "./components/Signup/EmailConfirmed";
import ConfirmEmail from "./components/Signup/ConfirmEmail";

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
          <NavBarUser authToken={authToken} setAuth={setAuth} />
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
          <NavBarUser authToken={authToken} setAuth={setAuth} />

          <Welcome
            authToken={authToken}
            setAuth={setAuth}
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
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

        <Route path="/users/activate/user/:id" exact>
          <EmailConfirmed authToken={authToken} setAuth={setAuth} />
        </Route>
        <Route path="/confirm-email" exact>
          <ConfirmEmail authToken={authToken} setAuth={setAuth} />
        </Route>
        <Route path="/create-post" exact>
          <NavBarUser authToken={authToken} setAuth={setAuth} />

          <CreatePost authToken={authToken} setAuth={setAuth} />
        </Route>
        <Route path="/update-post/:id" exact>
          <UpdatePost authToken={authToken} setAuth={setAuth} />
        </Route>
        <Route path="/report-post/:id" exact>
          <ReportPost authToken={authToken} setAuth={setAuth} />
        </Route>
        <Route path="/wallet" exact>
          <NavBarUser authToken={authToken} setAuth={setAuth} />
          <Wallet authToken={authToken} setAuth={setAuth} />
        </Route>

        <Route path="/wallet/buy-credits" exact>
          <NavBarUser authToken={authToken} setAuth={setAuth} />
          <BuyCredits authToken={authToken} setAuth={setAuth} />
        </Route>

        <Route path="/wallet/withdraw-cash" exact>
          <NavBarUser authToken={authToken} setAuth={setAuth} />
          <WithdrawCash authToken={authToken} setAuth={setAuth} />
        </Route>
        <Route path="/admin-panel" exact>
          <NavBar authToken={authToken} setAuth={setAuth} />
          <AdminPanel authToken={authToken} setAuth={setAuth} />
        </Route>
        <Route path="/admin-panel/withdraw-requests" exact>
          <NavBar authToken={authToken} setAuth={setAuth} />
          <WithdrawRequests authToken={authToken} setAuth={setAuth} />
        </Route>
        <Route path="/admin-panel/credit-requests" exact>
          <NavBar authToken={authToken} setAuth={setAuth} />
          <CreditRequests authToken={authToken} setAuth={setAuth} />
        </Route>
        <Route path="/admin-panel/content-reports" exact>
          <NavBar authToken={authToken} setAuth={setAuth} />
          <ContentReports authToken={authToken} setAuth={setAuth} />
        </Route>
        <Route path="/admin-panel/users" exact>
          <NavBar authToken={authToken} setAuth={setAuth} />
          <Users authToken={authToken} setAuth={setAuth} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
