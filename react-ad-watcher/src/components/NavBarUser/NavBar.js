import React, { useState, useEffect, useCallback } from "react";
import { withRouter } from "react-router-dom";
import Axios from "axios";
function NavBar(props) {
  const [wallet, setWallet] = useState();
  const [homeActive, setHomeActive] = useState("nav-link");
  const [CPActive, setCPActive] = useState("nav-link");
  const [walletActive, setWalletActive] = useState("nav-link dropdown-toggle");
  const url = window.location.pathname;

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
    if (
      url.substring(url.lastIndexOf("/") + 1) === "" ||
      url.substring(url.lastIndexOf("/") + 1) === "home"
    ) {
      setHomeActive("nav-link active");
    } else if (url.substring(url.lastIndexOf("/") + 1) === "create-post") {
      setCPActive("nav-link  active");
    } else if (
      url.substring(url.lastIndexOf("/") + 1) === "wallet" ||
      url.substring(url.lastIndexOf("/") + 1) === "buy-credits" ||
      url.substring(url.lastIndexOf("/") + 1) === "withdraw-cash"
    ) {
      setWalletActive("nav-link dropdown-toggle active");
    }
  }, [setHomeActive, setCPActive, setWalletActive, url]);
  useEffect(() => {
    if (!wallet) {
      fetchWallet();
    }
  }, [fetchWallet, wallet]);
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-info fixed-top mb-3">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            Ad Watcher
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className={homeActive} aria-current="page" href="/">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className={CPActive} href="/create-post">
                  Create Post
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className={walletActive}
                  href="/wallet"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {wallet && wallet.credits} Credits
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a className="dropdown-item btn-secondary" href="/wallet">
                    Wallet
                  </a>
                  <a
                    className="dropdown-item btn-secondary"
                    href="/wallet/buy-credits"
                  >
                    Buy Credits
                  </a>
                  <a
                    className="dropdown-item btn-secondary"
                    href="/wallet/withdraw-cash"
                  >
                    Withdraw Cash
                  </a>
                </div>
              </li>
            </ul>
            <form
              className="form-inline ml-auto my-2 my-lg-0"
              onSubmit={() => {
                props.setAuth("");
                props.history.push("/");
              }}
            >
              {" "}
              <label className="text-light">{wallet && wallet.user_id}:</label>
              <button className="btn btn-info" type="submit">
                Log Out
              </button>
            </form>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default withRouter(NavBar);
