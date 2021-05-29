import React, { useState } from "react";
import "./signup.css";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import Axios from "axios";
import "./signup.css";
import { withRouter } from "react-router-dom";

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
    <>
      <div className="card border-0 shadow p-10 cd-bg">
        <div className="card-body p-10 cd-body">
          <Form className="signup-form p-3">
            <h1>
              <span className="font-weight-bold ">SIGN UP</span>
            </h1>
            {isError && (
              <div>
                <span
                  className="font-weight-bold mt-6 mb-6"
                  style={{ color: "red" }}
                >
                  Passwords do not match
                </span>
              </div>
            )}
            {fieldEmpty && (
              <div>
                <span
                  className="font-weight-bold mt-6 mb-6"
                  style={{ color: "red" }}
                >
                  Check Credentials
                </span>
              </div>
            )}
            <FormGroup>
              <Label>First Name</Label>
              <Input
                className="form-control"
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
              <Label>Last Name</Label>
              <Input
                className="form-control"
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
              <Label>User Name</Label>
              <Input
                className="form-control"
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
              <Label>Email</Label>
              <Input
                className="form-control"
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
              <Label>Phone</Label>
              <Input
                className="form-control"
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
              <Label>Password</Label>
              <Input
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
              <Label>Confirm Password</Label>
              <Input
                type="password"
                placeholder="Confirm Password"
                value={passwordChk}
                onChange={(e) => setPasswordChk(e.target.value)}
              ></Input>
            </FormGroup>

            <Button
              className="btn-lg btn-dark btn-block"
              type="submit"
              onClick={signUpHandler}
            >
              Sign Up
            </Button>
            <div className="text-center pt-3">already have an account?</div>
            <Button
              className="btn-lg btn-dark btn-block"
              onClick={loginHandler}
            >
              Log In
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}

export default withRouter(Signup);
