import React, { useState, useEffect } from "react";
import "./login.css";
import Axios from "axios";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import {
  FacebookLoginButton,
  GoogleLoginButton,
} from "react-social-login-buttons";
import { withRouter } from "react-router-dom";

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
          console.log(err);
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
    <div
      className="container"
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <div className="card border-0 p-5 shadow cd-bg">
        <div className="card-body p-5 cd-body">
          <Form className="login-form p-3" onSubmit={loginHandler}>
            <h1>
              <span className="">ADWATCHER</span>
            </h1>
            {error && (
              <span
                className="font-weight-bold mt-6 mb-6"
                style={{ color: "red" }}
              >
                ERROR CHECK CREDENTIALS!!
              </span>
            )}
            <FormGroup>
              <Label>Email</Label>
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
            <FormGroup>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Password"
                value={userDetails.password}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, password: e.target.value })
                }
              ></Input>
            </FormGroup>

            <Button className="btn-lg btn-dark btn-block" type="submit">
              LOGIN
            </Button>
            <Button
              className="btn-lg btn-dark btn-block"
              onClick={signUpHandler}
            >
              Sign Up
            </Button>
            <div className="text-center pt-3">
              or continue with social media accounts?
            </div>
            <FacebookLoginButton className="btn-md btn-block mt-3 mb-3"></FacebookLoginButton>
            <GoogleLoginButton className="mt-3 mb-3" />
            <div className="text-center">
              <a href="/#">Forgot password?</a>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Login);
