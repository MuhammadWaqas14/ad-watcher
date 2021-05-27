import React, { useState, useCallback, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import { Card } from "reactstrap";

function WithdrawRequests(props) {
  const [user, setUser] = useState();
  const [withdrawRequests, setWithdrawRequests] = useState();
  const [currentRequest, setCurrentRequest] = useState();

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
    fetchWithdrawRequests();
    if (user && user.user_name !== "administrator") {
      alert("Unautrhorized, redirecting");
      props.history.push("/");
    }
  }, [fetchUser, user, props, fetchWithdrawRequests, currentRequest]);

  const deleteRequest = async (req) => {
    await Axios.delete(`/api/withdrawRequests/delete/${req._id}`, {
      headers: {
        Authorization: `${props.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        console.log("deleted");
        window.location.reload(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="container">
      <h1 className="display-4 text-center">Withdraw Requests</h1>
      <Card className="card col-12 text-center  mt-3 mb-3">
        <label className="card-header">Withdraw Requests</label>
        <div className="card-body h-50 ">
          <Card className="card">
            <ul className="list-unstyled text-left">
              {withdrawRequests &&
                withdrawRequests.map((wRequest) => (
                  <li
                    key={wRequest._id}
                    className="alert-success pb-3 mt-3 mb-3"
                  >
                    <label className="card-body w-75 h-auto">
                      {wRequest.user_id} has requested {wRequest.amount} cash in
                      account {wRequest.account} through
                      EasyPaisa/JazzCash/UPaisa Account.
                    </label>
                    <div className="p-2 mt-2 float-right">
                      <button
                        className="btn btn-success m-2"
                        onClick={() => {
                          setCurrentRequest(wRequest);
                          setCurrentRequest((currentRequest) => {
                            deleteRequest(currentRequest);
                            console.log(currentRequest);
                            return currentRequest;
                          });
                        }}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger m-2"
                        onClick={() => {
                          setCurrentRequest(wRequest);
                          setCurrentRequest((currentRequest) => {
                            deleteRequest(currentRequest);
                            console.log(currentRequest);
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
          </Card>
        </div>
      </Card>
    </div>
  );
}

export default withRouter(WithdrawRequests);
