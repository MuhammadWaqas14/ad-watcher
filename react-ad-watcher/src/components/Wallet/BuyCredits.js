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
          setErrors({ ...errors, transaction_id: "Transaction ID required*" });
        } else {
          alert("Error sending request try again later");
          console.log(err);
          props.history.push("/");
        }
      });
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
    <div className="container">
      <h1 className="display-3 mt-3">Buy Credits</h1>
      <h1 className="alert alert-success display-4 mt-3">
        Want to Buy Credits? you currently have{' "'}
        {wallet ? wallet.credits : "fetching"} Credits"
      </h1>
      <h5 className="label-success mb-5">
        Enter transaction details after making a deposit of how many credits you
        would like to buy through "JazzCash / EasyPaisa / UPaisa" to mobile
        account "0303 5571688" and submit the transaction details below for
        review.
      </h5>
      {errors && errors.transaction_id !== "" && (
        <label className="alert-danger">{errors.transaction_id}</label>
      )}
      <div className="form-floating mb-3">
        <input
          className="form-control"
          type="text"
          id="floatingInput1"
          placeholder="Transaction Id"
          onChange={(e) => {
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
        <label htmlFor="floatingInput1">Transaction ID:</label>
      </div>
      {errors && errors.amount !== "" && (
        <label className="alert-danger">{errors.amount}</label>
      )}
      <div className="form-floating mb-3">
        <input
          className="form-control"
          type="number"
          id="floatingInput2"
          placeholder="Deposited Amount"
          onChange={(e) => {
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
        <label for="floatingInput2">Deposited Amount:</label>
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
  );
}

export default withRouter(BuyCredits);
