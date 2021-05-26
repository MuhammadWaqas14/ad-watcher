import React, { useCallback, useState, useEffect } from "react";
import Axios from "axios";
import { withRouter } from "react-router-dom";

function WithdrawCash(props) {
  const [user, setUser] = useState();
  const [wallet, setWallet] = useState();
  const [withdrawLimitError, setWithdrawLimitError] = useState(false);

  const [withdrawRequest, setWithdrawRequest] = useState({
    account: "",
    amount: "",
    user_id: "",
  });
  const [errors, setErrors] = useState({
    account: "",
    amount: "",
  });

  const requestWithdraw = (withdrawRequest) => {
    Axios.post("/api/withdrawRequests/create", withdrawRequest, {
      headers: {
        Authorization: `${props.authToken}`,
      },
    })
      .then((res) => {
        console.log(res);
        alert("Submitted");
        props.history.push("/");
      })
      .catch((err) => {
        if (withdrawRequest.account === "" && withdrawRequest.amount === "") {
          setErrors({
            ...errors,
            account: "Account required*",
            amount: "Amount required*",
          });
        } else if (withdrawRequest.amount === "") {
          setErrors({ ...errors, amount: "Amount required*" });
        } else if (withdrawRequest.account === "") {
          setErrors({ ...errors, account: "Account required*" });
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
    <div className="container container-sm container-md container-lg">
      {wallet && (
        <>
          <h1 className="display-3 mt-3">Withdraw Cash</h1>
          <h1 className="display-4 alert-success mt-5">
            You currently have {wallet.credits} credits to withdraw
          </h1>

          <h1 className="display-6 mt-3 text-center">
            Select Number of Credits to withdraw
          </h1>
          {parseInt(wallet.credits) <= 500 && (
            <h6 className=" alert alert-danger mt-3">
              We're Sorry You cannot withdraw right now, you don't have enough
              credits
            </h6>
          )}
          <div className="form-floating mt-5">
            <input
              className="form-control"
              type="number"
              id="floatingInput1"
              placeholder="Enter Credits Here"
              onChange={(e) => {
                if (e.target.value % 500 === 0 && parseInt(e.target.value)) {
                  setWithdrawLimitError(false);
                  setWithdrawLimitError((withdrawLimitError) => {
                    return withdrawLimitError;
                  });

                  setWithdrawRequest({
                    ...withdrawRequest,
                    amount: e.target.value,
                    user_id: user.user_name,
                  });
                  setWithdrawRequest((withdrawRequest) => {
                    console.log(withdrawRequest);
                    return withdrawRequest;
                  });
                } else {
                  setWithdrawLimitError(true);
                  console.log(withdrawRequest);
                }
              }}
            ></input>
            <label htmlFor="floatingInput1">Credits to Withdraw here:</label>
          </div>
          {withdrawLimitError && (
            <h6 className="alert alert-danger mt-3">
              Please enter a valid number of credits (multiple of 500)
            </h6>
          )}

          <div className="form-floating mt-3">
            <input
              className="form-control"
              type="text"
              id="floatingInput2"
              placeholder="JazzCash/EasyPaisa/Upaisa Account"
              onChange={(e) => {
                setWithdrawRequest({
                  ...withdrawRequest,
                  account: e.target.value,
                  user_id: user.user_name,
                });
                setWithdrawRequest((withdrawRequest) => {
                  console.log(withdrawRequest);
                  return withdrawRequest;
                });

                if (!parseInt(e.target.value)) {
                  setErrors({ ...errors, account: "Account Required" });
                }
              }}
            ></input>
            <label htmlFor="floatingInput1">
              JazzCash/EasyPaisa/UPaisa Account:
            </label>
          </div>
          {errors.account !== "" && errors && (
            <h6 className="alert alert-danger mt-3">
              Please enter a valid account number
            </h6>
          )}
          <br />
          <button
            className="btn btn-info mt-3"
            disabled={withdrawLimitError && wallet.credits < 500}
            onClick={() => {
              requestWithdraw(withdrawRequest);
            }}
          >
            {" "}
            Submit Request
          </button>
        </>
      )}
    </div>
  );
}

export default withRouter(WithdrawCash);
