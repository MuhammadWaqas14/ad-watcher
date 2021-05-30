import React, { useState, useEffect, useCallback } from "react";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import "./Wallet.css";
function Wallet(props) {
  const [wallet, setWallet] = useState();
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
    fetchWallet();
  }, [fetchWallet]);

  return (
    <div className="container card-containercp">
      {wallet && (
        <>
          <div className="card shadow mt-5 pb-5">
            <h1 className="card-title bg-info text-light pr-4 pt-2 pl-2 pb-2 mt-n2 ml-n2 mr-n2 mb-n1 text-center">
              <span>Create Post</span>
            </h1>
            <div className="text-center mt-5 mb-5">
              <h1 className="display-4 text-center w-100">
                You Currently have
              </h1>
              <h1 className="text-center display-1 w-100 ">{wallet.credits}</h1>
              <h1 className="display-4 text-center w-100">Credits </h1>
            </div>
            <button
              className="btn btn-info btn-block m-3 m-auto w-25"
              style={{ marginTop: "3" }}
              onClick={() => {
                props.history.push("/wallet/buy-credits");
              }}
            >
              Buy Credits
            </button>
            <br />
            <button
              className="btn btn-info m-5 m-auto w-25"
              onClick={() => {
                props.history.push("/wallet/withdraw-cash");
              }}
            >
              Withdraw Cash
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default withRouter(Wallet);
