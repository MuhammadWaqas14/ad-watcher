import React, { useState, useEffect, useCallback } from "react";
import { Card } from "reactstrap";
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
    <div className="">
      {wallet && (
        <>
          <label className="display-3 ml-5 mt-5">Wallet Details</label>
          <Card
            className="card text-center m-5 bg-dark"
            style={{ color: "white" }}
          >
            <h1 className="display-4 text-center w-100">You Currently have</h1>
            <h1 className="text-center display-1 w-100 ">{wallet.credits}</h1>
            <h1 className="display-4 text-center w-100">Credits </h1>
          </Card>
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
            className="btn btn-info btn-block m-auto w-25"
            style={{ marginTop: "3" }}
            onClick={() => {
              props.history.push("/wallet/withdraw-cash");
            }}
          >
            Withdraw Cash
          </button>
        </>
      )}
    </div>
  );
}

export default withRouter(Wallet);
