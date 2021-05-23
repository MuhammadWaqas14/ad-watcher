import React, { useState, useEffect, useCallback } from "react";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import "./AdminPanel.css";

function AdminPanel(props) {
  const [user, setUser] = useState();
  const [reports, setReports] = useState();

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
        console.log(res.data);
        setReports(res.data);
      })
      .catch((err) => {
        console.log(err);
        //props.setAuth("");
        //props.history.push("/login");
      });
  }, [props]);

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
    fetchReports();
    if (user && user.user_name !== "administrator") {
      alert("Unautrhorized, redirecting");
      props.history.push("/");
    }
  }, [fetchUser, user, props, fetchReports]);

  return (
    <div className="container">
      <h3 className="text-center alert-success mt-4 mb-4">
        Welcome to Admin Panel For Ad Watcher
      </h3>

      <card className="card col-12 text-center float-none mt-3">
        <label className="card-header">Content Reports</label>
        <div className="card-body h-50 ">
          <card className="card">
            <ul className="list-unstyled text-left">
              {reports &&
                reports.map((report) => (
                  <li key={report.id}>
                    <label className="card-body alert-danger w-100 h-100">
                      Reported by {report.user_id} for the reason:{" "}
                      {report.reason}
                      <button className="btn btn-info float-right m-3">
                        View Post
                      </button>
                    </label>
                  </li>
                ))}
            </ul>
          </card>
        </div>
      </card>

      <card className="card col-12 text-center mt-4">
        <label className="card-header">Credit Requests</label>
        <div className="card-body h-50 "></div>
      </card>
      <card className="card col-12 text-center mt-4">
        <label className="card-header">Transaction Requests</label>
        <div className="card-body"></div>
      </card>
    </div>
  );
}

export default withRouter(AdminPanel);
