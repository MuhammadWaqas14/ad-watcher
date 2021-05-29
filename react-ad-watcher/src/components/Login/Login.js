import React, { useState, useEffect } from "react";
import "./login.css";
import Axios from "axios";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { withRouter } from "react-router-dom";
import Logo from "../AdwatcherLogo.png";
function Login(props) {
  const [error, setError] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    if (props.authToken !== "") {
      props.history.push("/home");
    }
  }, [props, error]);
  const loginHandler = async (e) => {
    e.preventDefault();
    if (userDetails.email !== "" && userDetails.password !== "") {
      await Axios.post("/api/users/login", userDetails)
        .then((res) => {
          if (userDetails.email !== "admin@adwatcher.com") {
            props.setAuth(res.data.token);
            setError(false);
            props.setLoggedIn(true);
            props.setSignUpCall(false);
            props.history.push("/home");
          } else {
            console.log(res.data);
            props.setAuth(res.data.token);
            setError(false);
            props.setLoggedIn(true);
            props.setSignUpCall(false);
            props.history.push("/admin-panel");
          }
        })
        .catch((err) => {
          setError(true);
        });
    } else {
      setError(true);
      props.setLoggedIn(false);
    }
  };
  const signUpHandler = () => {
    props.setSignUpCall(true);
    props.history.push("/signup");
  };

  return (
    <div className="container p-5 mt-5">
      <h1 className="display-3 card-header text-center mt-5 text-light bg-info">
        AdWatcher
      </h1>
      <div className="card">
        <div className="navbar-link image-logo">
          <img src={Logo} width="50%" height="50%" alt="Ad Watcher"></img>
        </div>
        <div className="card ml-auto  float-right">
          <h3 className="card-title mt-3 text-center">Login</h3>
          <div className="card-body m-5 ">
            <Form className="mt-n5 p-3" onSubmit={loginHandler}>
              {error && (
                <span
                  className="font-weight-bold mt-6 mb-6"
                  style={{ color: "red" }}
                >
                  ERROR CHECK CREDENTIALS!!
                </span>
              )}
              <FormGroup className="mt-3 ">
                <Label>Email:</Label>
                <Input
                  className="form-control"
                  name="email"
                  id="email"
                  type="email"
                  value={userDetails.email}
                  placeholder="Email"
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, email: e.target.value })
                  }
                ></Input>
              </FormGroup>
              <FormGroup className="mt-3 ">
                <Label className="mt-3 ">Password:</Label>
                <Input
                  className="form-control"
                  type="password"
                  placeholder="Password"
                  value={userDetails.password}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, password: e.target.value })
                  }
                ></Input>
              </FormGroup>

              <Button
                className="btn btn-info mt-5 ml-3 mr-3 mb-3"
                type="submit"
              >
                Login
              </Button>
              <Button
                className="btn btn-info mt-5 ml-3 mr-3 mb-3"
                onClick={signUpHandler}
              >
                Sign Up
              </Button>
              <div className="text-center ">
                <a className="" href="/#">
                  Forgot password?
                </a>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Login);
