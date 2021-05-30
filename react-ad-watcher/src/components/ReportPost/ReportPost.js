import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import "./ReportPost.css";
import { withRouter } from "react-router-dom";

function ReportPost(props) {
  var url = window.location.pathname;
  var postId = url.substring(url.lastIndexOf("/") + 1);

  const [report, setReport] = useState({
    post: postId,
    reason: "",
    user_id: "",
  });
  const [error, setError] = useState("");
  const [user, setUser] = useState();

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

  const sendReport = (report) => {
    Axios.post("/api/reports/create", report, {
      headers: {
        Authorization: `${props.authToken}`,
      },
    })
      .then((res) => {
        props.history.push("/");
      })
      .catch((err) => {
        props.history.push("/");
        alert("Error sending report try again later");
      });
  };
  const getReport = () => {
    if (document.getElementById("flexRadioDefault1").checked) {
      setError("");
      setReport({ ...report, reason: "it's spam", user_id: user.user_name });
      setReport((report) => {
        sendReport(report);
        return report;
      });
    } else if (document.getElementById("flexRadioDefault2").checked) {
      setError("");
      setReport({
        ...report,
        reason: "Nudity or sexual activity",
        user_id: user.user_name,
      });
      setReport((report) => {
        sendReport(report);
        return report;
      });
    } else if (document.getElementById("flexRadioDefault3").checked) {
      setError("");
      setReport({
        ...report,
        reason: "Violence or dangerous organizations",
        user_id: user.user_name,
      });
      setReport((report) => {
        sendReport(report);
        return report;
      });
    } else if (document.getElementById("flexRadioDefault4").checked) {
      setError("");
      setReport({
        ...report,
        reason: "Sale of illegal or regulated Goods",
        user_id: user.user_name,
      });
      setReport((report) => {
        sendReport(report);
        return report;
      });
    } else {
      setError("Please select a reason for reporting");
      console.log("Error");
    }
  };
  useEffect(() => {
    if (props.authToken === "") {
      props.history.push("/login");
    }
  }, [props]);
  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [fetchUser, user]);
  return (
    <div className="container card-containercp">
      <div className="card shadow mt-3">
        <h1 className="card-title bg-info text-light pr-4 pt-2 pl-2 pb-2 mt-n2 ml-n2 mr-n2 mb-n1 text-center">
          <span>Report Post</span>
        </h1>
        <div className="card-body m-auto pt-5 pb-5">
          <h4 className="mb-3 pt-3 pb-3 font-weight-light">
            Why are you reporting this post?
          </h4>
          <div className="form-check  mt-2">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault1"
            />
            <label className="form-check-label" htmlFor="flexRadioDefault1">
              it's spam
            </label>
          </div>
          <div className="form-check mt-2">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault2"
            />
            <label className="form-check-label" htmlFor="flexRadioDefault2">
              Nudity or sexual activity
            </label>
          </div>
          <div className="form-check mt-2">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault3"
            />
            <label className="form-check-label" htmlFor="flexRadioDefault3">
              Violence or dangerous organizations
            </label>
          </div>
          <div className="form-check mt-2">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault4"
            />
            <label className="form-check-label" htmlFor="flexRadioDefault4">
              Sale of illegal or regulated Goods
            </label>
          </div>
          {error !== "" && (
            <h6 className="alert-danger w-75 mt-3">
              Please Select a Reason for reporting
            </h6>
          )}
          <button className="btn btn-info m-4" onClick={() => getReport()}>
            Report
          </button>
          <button
            className="btn btn-info m-4"
            onClick={() => props.history.push("/")}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default withRouter(ReportPost);
