import React, { useState, useCallback, useEffect } from "react";
import Axios from "axios";
import { withRouter } from "react-router-dom";

function BuyCredits(props) {
  const [user, setUser] = useState();
  const [wallet, setWallet] = useState();
  const [creditRequest, setCreditRequest] = useState({
    transaction_id: "",
    amount: "",
    user_id: "",
  });
  const [errors, setErrors] = useState();

  const requestCredits = (creditRequest) => {
    if (errors.transaction_id === "" && errors.amount === "") {
      Axios.post("/api/creditRequests/create", creditRequest, {
        headers: {
          Authorization: `${props.authToken}`,
        },
      })
        .then((res) => {
          console.log(res);
          props.history.push("/");
        })
        .catch((err) => {
          if (
            creditRequest.transaction_id === "" &&
            creditRequest.amount === ""
          ) {
            setErrors({
              ...errors,
              transaction_id: "Transaction ID required*",
              amount: "Amount required*",
            });
          } else if (creditRequest.amount === "") {
            setErrors({ ...errors, amount: "Amount required*" });
          } else if (creditRequest.transaction_id === "") {
            setErrors({
              ...errors,
              transaction_id: "Transaction ID required*",
            });
          } else {
            alert("Error sending request try again later");
            console.log(err);
            props.history.push("/");
          }
        });
    }
  };

  const fetchUser = useCallback(async () => {
    await Axios.get("/api/posts/user", {
      headers: {
        Authorization: `${props.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        props.setAuth("");
        props.history.push("/login");
      });
  }, [props]);

  const fetchWallet = useCallback(async () => {
    await Axios.get("/api/wallets", {
      headers: {
        Authorization: `${props.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        setWallet(res.data[0]);
      })
      .catch((err) => {
        props.setAuth("");
        props.history.push("/login");
      });
  }, [props]);

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
    if (!wallet) {
      fetchWallet();
    }
  }, [fetchUser, fetchWallet, user, wallet]);

  return (
    <div className="container card-containercp">
      <div className="card shadow mt-5">
        <h1 className="card-title bg-info text-light pr-4 pt-2 pl-2 pb-2 mt-n2 ml-n2 mr-n2 mb-n1 text-center">
          <span>Buy Credits</span>
        </h1>
        <div className="card-body">
          <h1 className="display-4 text-center w-100">
            You have{" "}
            <span className="font-weight-bold">
              {wallet ? wallet.credits : "fetching"}
            </span>{" "}
            Credits.{" "}
          </h1>
          <h4 className="label-success mb-5 font-weight-light">
            Enter transaction details after making a deposit, of any amount of
            credits you would like to buy, through "JazzCash / EasyPaisa /
            UPaisa" to mobile account "0303 5571688" and submit the transaction
            details below for review.
          </h4>

          <div className="form-floating mb-3">
            <label htmlFor="floatingInput1">Transaction ID:</label>
            <input
              className="form-control"
              type="text"
              id="floatingInput1"
              placeholder="Transaction ID"
              onChange={(e) => {
                if (e.target.value.trim() === "") {
                  setErrors({
                    ...errors,
                    transaction_id: " Transaction ID Required* ",
                  });
                } else {
                  setErrors({
                    ...errors,
                    transaction_id: "",
                  });
                }
                setCreditRequest({
                  ...creditRequest,
                  transaction_id: e.target.value,
                  user_id: user.user_name,
                });
                setCreditRequest((creditRequest) => {
                  return creditRequest;
                });
              }}
            ></input>
            {errors && errors.transaction_id !== "" && (
              <label className="alert-danger mt-2">
                {errors.transaction_id}
              </label>
            )}
          </div>

          <div className="form-floating mt-2 mb-3">
            <label for="floatingInput2">Deposited Amount:</label>
            <input
              className="form-control"
              type="number"
              id="floatingInput2"
              placeholder="Deposited Amount"
              onChange={(e) => {
                if (e.target.value.toString().trim() === "") {
                  setErrors({ ...errors, amount: " Amount Required* " });
                } else {
                  setErrors({
                    ...errors,
                    amount: "",
                  });
                }
                setCreditRequest({
                  ...creditRequest,
                  amount: e.target.value.toString(),
                  user_id: user.user_name,
                });
                setCreditRequest((creditRequest) => {
                  return creditRequest;
                });
              }}
            ></input>
            {errors && errors.amount !== "" && (
              <label className="alert-danger mt-2">{errors.amount}</label>
            )}
          </div>
          <button
            className="btn btn-info mt-3"
            type="submit"
            onClick={() => {
              requestCredits(creditRequest);
            }}
          >
            {" "}
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}

export default withRouter(BuyCredits);
