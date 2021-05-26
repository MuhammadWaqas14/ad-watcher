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
        console.log(err);
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

  return (
    <div className="container">
      <h3 className="text-center alert-success mt-4 mb-4">
        Welcome to Admin Panel For Ad Watcher
      </h3>

      <Card className="card col-12 text-center float-none mt-3">
        <label className="card-header">Content Reports</label>
        <div className="card-body h-50 ">
          <Card className="card">
            <ul className="list-unstyled text-left">
              {reports &&
                reports.map((report) => (
                  <li key={report.id} className="alert-danger pb-3">
                    <label className="card-body w-auto h-auto">
                      Reported by {report.user_id} for the reason:{" "}
                      {report.reason}.
                    </label>
                    <div className="p-2 mt-2 float-right">
                      <button className="btn btn-info m-2">View Post</button>
                    </div>
                  </li>
                ))}
            </ul>
          </Card>
        </div>
      </Card>

      <Card className="card col-12 text-center mt-4">
        <label className="card-header">Credit Requests</label>
        <div className="card-body h-50 ">
          <Card className="card">
            <ul className="list-unstyled text-left">
              {creditRequests &&
                creditRequests.map((cRequest) => (
                  <li key={cRequest.id} className="alert-success pb-3">
                    <label className="card-body w-auto h-auto">
                      {cRequest.user_id} has requested {cRequest.amount} credits
                      by performing a transaction with ID:{" "}
                      {cRequest.transaction_id}
                    </label>
                    <div className="p-2 mt-2 float-right">
                      <button className="btn btn-success m-2">Approve</button>
                      <button className="btn btn-danger m-2">Deny</button>
                    </div>
                  </li>
                ))}
            </ul>
          </Card>
        </div>
      </Card>
      <Card className="card col-12 text-center mt-4">
        <label className="card-header">Withdraw Requests</label>
        <div className="card-body h-50 ">
          <Card className="card">
            <ul className="list-unstyled text-left">
              {withdrawRequests &&
                withdrawRequests.map((wRequest) => (
                  <li key={wRequest.id} className="alert-success pb-3">
                    <label className="card-body w-auto h-auto">
                      {wRequest.user_id} has requested {wRequest.amount} cash in
                      account {wRequest.account} through
                      EasyPaisa/JazzCash/UPaisa Account.
                    </label>
                    <div className="p-2 mt-2 float-right">
                      <button className="btn btn-success m-2">Approve</button>
                      <button className="btn btn-danger m-2">Deny</button>
                    </div>
                  </li>
                ))}
            </ul>
          </Card>
        </div>
      </Card>
    </div>
  );
}

export default withRouter(AdminPanel);
