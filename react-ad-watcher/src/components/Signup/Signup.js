import React, { useState } from "react";
import "./signup.css";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import Axios from "axios";
import "./signup.css";
import { withRouter } from "react-router-dom";
import Logo from "../AdwatcherLogo.png";

function Signup(props) {
  const [userDetails, setUserDetails] = useState({
    first_name: "",
    last_name: "",
    user_name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [walletDetails, setWalletDetails] = useState({
    credits: "0",
    phone: "",
    type: "Standard: JC,EP,Bank",
    total_trans: "0",
    user_id: "",
  });

  const [passwordChk, setPasswordChk] = useState("");
  const [isError, setIsError] = useState(false);
  const [fieldEmpty, setFieldEmpty] = useState(false);

  const signUpHandler = (e) => {
    e.preventDefault();
    if (userDetails.password !== passwordChk) {
      setIsError(true);
    }
    if (
      !isError &&
      userDetails.first_name !== "" &&
      userDetails.last_name !== "" &&
      userDetails.user_name !== "" &&
      userDetails.email !== "" &&
      userDetails.phone !== "" &&
      userDetails.password !== ""
    ) {
      Axios.post("/api/users/signup", userDetails)
        .then((res) => {
          Axios.post("/api/users/login", userDetails)
            .then((res) => {
              props.setAuth(res.data.token);
              props.setLoggedIn(true);
              props.setSignUpCall(false);

              Axios.post("/api/wallets/create", walletDetails, {
                headers: {
                  Authorization: `${res.data.token}`,
                },
              })
                .then((rsp) => {
                  props.history.push("/confirm-email");
                })
                .catch((errr) => console.log(errr));
            })
            .catch((err) => {});
        })
        .catch((err) => {});
    } else {
      setFieldEmpty(true);
    }
  };

  const loginHandler = () => {
    props.setLoggedIn(false);
    props.setSignUpCall(false);
    props.history.push("/login");
  };
  return (
    <div className="container p-5 mt-5">
      <h1 className="display-3 card-header text-center mt-5 text-light bg-info">
        AdWatcher
      </h1>
      <div className="card ">
        <div className="navbar-link image-logo">
          <img src={Logo} width="50%" height="50%" alt="Ad Watcher"></img>
        </div>
        <div className="card ml-auto  float-right">
          <h3 className="card-title mt-3 mb-n3 text-center">Sign Up</h3>
          <div className="card-body m-5 ">
            <Form className="mt-n5 mb-n5 p-3">
              {isError && (
                <>
                  <label className="alert-danger ml-n5">
                    Passwords do not match
                  </label>
                </>
              )}
              {fieldEmpty && (
                <>
                  <label className="alert-danger ml-n5">
                    Check Details, try again.
                  </label>
                </>
              )}
              <FormGroup>
                <Label className="label-default position-absolute ml-n5 mt-2">
                  First Name:
                </Label>
                <Input
                  className="form-control ml-5"
                  type="text"
                  value={userDetails.first_name}
                  placeholder="First Name"
                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      first_name: e.target.value,
                    })
                  }
                />
              </FormGroup>
              <FormGroup>
                <Label className="label-default position-absolute ml-n5 mt-2">
                  Last Name:
                </Label>
                <Input
                  className="form-control ml-5"
                  type="text"
                  value={userDetails.last_name}
                  placeholder="Last Name"
                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      last_name: e.target.value,
                    })
                  }
                ></Input>
              </FormGroup>
              <FormGroup>
                <Label className="label-default position-absolute ml-n5 mt-2">
                  Username:
                </Label>
                <Input
                  className="form-control ml-5"
                  type="text"
                  value={userDetails.user_name}
                  placeholder="User Name"
                  onChange={(e) => {
                    setUserDetails({
                      ...userDetails,
                      user_name: e.target.value,
                    });
                    setWalletDetails({
                      ...walletDetails,
                      user_id: e.target.value,
                    });
                  }}
                ></Input>
              </FormGroup>
              <FormGroup>
                <Label className="label-default position-absolute ml-n5 mt-2">
                  Email:
                </Label>
                <Input
                  className="form-control ml-5"
                  type="email"
                  value={userDetails.email}
                  placeholder="Email"
                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      email: e.target.value,
                    })
                  }
                ></Input>
              </FormGroup>
              <FormGroup>
                <Label className="label-default position-absolute ml-n5 mt-2">
                  Phone:
                </Label>
                <Input
                  className="form-control ml-5"
                  type="text"
                  value={userDetails.phone}
                  placeholder="Phone"
                  onChange={(e) => {
                    setUserDetails({
                      ...userDetails,
                      phone: e.target.value,
                    });
                    setWalletDetails({
                      ...walletDetails,
                      phone: e.target.value,
                    });
                  }}
                ></Input>
              </FormGroup>
              <FormGroup>
                <Label className="label-default position-absolute ml-n5 mt-2">
                  Password:
                </Label>
                <Input
                  className="form-control ml-5"
                  type="password"
                  placeholder="Password"
                  value={userDetails.password}
                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      password: e.target.value,
                    })
                  }
                ></Input>
              </FormGroup>
              <FormGroup>
                <Label className="label-default position-absolute ml-n5 mt-2">
                  Confirm:
                </Label>
                <Input
                  className="form-control ml-5"
                  type="password"
                  placeholder="Confirm Password"
                  value={passwordChk}
                  onChange={(e) => setPasswordChk(e.target.value)}
                ></Input>
              </FormGroup>

              <Button
                className="btn btn-info ml-3 mr-3 mb-n3"
                type="submit"
                onClick={signUpHandler}
              >
                Sign Up
              </Button>

              <Button
                className="btn btn-info ml-3 mr-3 mb-n3"
                onClick={loginHandler}
              >
                Log In
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Signup);
