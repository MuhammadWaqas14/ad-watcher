import React, { useState, useEffect, useCallback } from "react";
import { withRouter } from "react-router-dom";
import { Card } from "reactstrap";
import Axios from "axios";
import "./AdminPanel.css";

function AdminPanel(props) {
  const [user, setUser] = useState();
  const [reports, setReports] = useState();
  const [creditRequests, setCreditRequests] = useState();
  const [withdrawRequests, setWithdrawRequests] = useState();
  const [wallet, setWallet] = useState();
  const [currentRequest, setCurrentRequest] = useState();

  const [currentWRequest, setCurrentWRequest] = useState();

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

  const fetchReports = useCallback(async () => {
    await Axios.get("/api/reports/", {
      headers: {
        Authorization: `${props.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        setReports(res.data);
      })
      .catch((err) => {
        props.setAuth("");
        props.history.push("/login");
      });
  }, [props]);

  const fetchCreditRequests = useCallback(async () => {
    await Axios.get("/api/creditRequests/", {
      headers: {
        Authorization: `${props.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        setCreditRequests(res.data);
      })
      .catch((err) => {
        props.setAuth("");
        props.history.push("/login");
      });
  }, [props]);

  const fetchWithdrawRequests = useCallback(async () => {
    await Axios.get("/api/withdrawRequests/", {
      headers: {
        Authorization: `${props.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        setWithdrawRequests(res.data);
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

    fetchReports();
    fetchCreditRequests();
    fetchWithdrawRequests();
    if (user && user.user_name !== "administrator") {
      alert("Unautrhorized, redirecting");
      props.history.push("/");
    }
  }, [
    fetchUser,
    user,
    props,
    fetchReports,
    fetchCreditRequests,
    fetchWithdrawRequests,
  ]);

  const deleteCRequest = async (req) => {
    await Axios.get(`/api/wallets/${req.user_id}`, {
      headers: {
        Authorization: `${props.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        setWallet(res.data[0]);
        setWallet((wallet) => {
          wallet._id = wallet._id;
          wallet.phone = wallet.phone;
          wallet.total_trans = wallet.total_trans;
          wallet.user_id = wallet.user_id;
          wallet.credits = (
            parseInt(wallet.credits) + parseInt(req.amount)
          ).toString();
          console.log(wallet);
          Axios.patch(`/api/wallets/update/${wallet._id}`, wallet, {
            headers: {
              Authorization: `${props.authToken}`,
            },
          })
            .then((res) => {})
            .catch((err) => {
              console.log(err);
            });
          return wallet;
        });
      })
      .catch((err) => {
        props.setAuth("");
        props.history.push("/login");
      });

    await Axios.delete(`/api/creditRequests/delete/${req._id}`, {
      headers: {
        Authorization: `${props.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        window.location.reload(false);
      })
      .catch((err) => {});
  };
  const deleteWRequest = async (req) => {
    await Axios.delete(`/api/withdrawRequests/delete/${req._id}`, {
      headers: {
        Authorization: `${props.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        window.location.reload(false);
      })
      .catch((err) => {});
  };

  return (
    <div className="container card-containerap">
      <Card className="card shadow col-12 text-center mt-3 mb-3 card-division">
        <h3 className="card-title bg-info text-light pr-4 pt-2 pl-2 pb-2 mt-n2 ml-n4 mr-n4 mb-n1 text-center">
          <span>Content Reports</span>
        </h3>
        <div className="card-body h-50 ">
          <Card className="card">
            <ul className="list-unstyled text-left">
              {reports &&
                reports.map((report) => (
                  <li key={report._id} className="alert-danger pb-3 mt-3 mb-3">
                    <label className="card-body w-50 h-auto">
                      Reported by{" "}
                      <span className="font-weight-bold">{report.user_id}</span>{" "}
                      for the reason:{" "}
                      <span className="font-weight-bold">{report.reason}</span>.
                    </label>
                  </li>
                ))}
            </ul>
            <div className="p-2 mt-2 text-center">
              <a className="link-secondary" href="/admin-panel/content-reports">
                see more...
              </a>
            </div>
          </Card>
        </div>
      </Card>

      <Card className="card shadow col-12 text-center mt-4 card-division ">
        <h3 className="card-title bg-info text-light pr-4 pt-2 pl-2 pb-2 mt-n2 ml-n4 mr-n4 mb-n1 text-center">
          <span>Credit Requests</span>
        </h3>
        <div className="card-body h-50 ">
          <Card className="card">
            <ul className="list-unstyled text-left">
              {creditRequests &&
                creditRequests.map((cRequest) => (
                  <li
                    key={cRequest._id}
                    className="alert-success pb-3 mt-3 mb-3"
                  >
                    <label className="card-body w-50 h-auto">
                      <span className="font-weight-bold">
                        {cRequest.user_id}
                      </span>{" "}
                      has requested{" "}
                      <span className="font-weight-bold">
                        {cRequest.amount}
                      </span>{" "}
                      credits by performing a transaction with{" "}
                      <span className="font-weight-bold">
                        ID: {cRequest.transaction_id}
                      </span>
                    </label>
                    <div className="p-2 mt-2 float-right">
                      <button
                        className="btn btn-success m-2"
                        onClick={() => {
                          setCurrentRequest(cRequest);
                          setCurrentRequest((currentRequest) => {
                            deleteCRequest(currentRequest);
                            return currentRequest;
                          });
                        }}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger m-2"
                        onClick={() => {
                          setCurrentRequest(cRequest);
                          setCurrentRequest((currentRequest) => {
                            deleteCRequest(currentRequest);
                            return currentRequest;
                          });
                        }}
                      >
                        Deny
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
            <div className="p-2 mt-2 text-center">
              <a className="" href="/admin-panel/credit-requests">
                see more...
              </a>
            </div>
          </Card>
        </div>
      </Card>
      <Card className="card col-12 text-center mt-4 card-division">
        <h3 className="card-title bg-info text-light pr-4 pt-2 pl-2 pb-2 mt-n2 ml-n4 mr-n4 mb-n1 text-center">
          <span>Withdraw Requests</span>
        </h3>
        <div className="card-body h-50 ">
          <Card className="card">
            <ul className="list-unstyled text-left">
              {withdrawRequests &&
                withdrawRequests.map((wRequest) => (
                  <li
                    key={wRequest._id}
                    className="alert-warning pb-3 mt-3 mb-3"
                  >
                    <label className="card-body w-50 h-auto">
                      <span className="font-weight-bold">
                        {wRequest.user_id}
                      </span>{" "}
                      has requested{" "}
                      <span className="font-weight-bold">
                        {wRequest.amount}
                      </span>{" "}
                      cash in account{" "}
                      <span className="font-weight-bold">
                        {wRequest.account}
                      </span>{" "}
                      through{" "}
                      <span className="font-weight-bold">
                        EasyPaisa/JazzCash/UPaisa
                      </span>{" "}
                      Account.
                    </label>
                    <div className="p-2 mt-2 float-right">
                      <button
                        className="btn btn-success m-2"
                        onClick={() => {
                          setCurrentWRequest(wRequest);
                          setCurrentWRequest((currentWRequest) => {
                            deleteWRequest(currentWRequest);
                            return currentWRequest;
                          });
                        }}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger m-2"
                        onClick={() => {
                          setCurrentWRequest(wRequest);
                          setCurrentWRequest((currentWRequest) => {
                            deleteWRequest(currentWRequest);
                            return currentWRequest;
                          });
                        }}
                      >
                        Deny
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
            <div className="p-2 mt-2 text-center">
              <a
                className="link-secondary"
                href="/admin-panel/withdraw-requests"
              >
                see more...
              </a>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
}

export default withRouter(AdminPanel);
