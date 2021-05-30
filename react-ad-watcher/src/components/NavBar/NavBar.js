import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
function NavBar(props) {
  const [dashActive, setDashActive] = useState("nav-link");
  const [CRpActive, setCRpActive] = useState("nav-link");
  const [CRqActive, setCRqActive] = useState("nav-link");
  const [WRActive, setWRActive] = useState("nav-link");
  const [usersActive, setUsersActive] = useState("nav-link");
  const url = window.location.pathname;

  useEffect(() => {
    if (url.substring(url.lastIndexOf("/") + 1) === "admin-panel") {
      setDashActive("nav-link active");
    } else if (url.substring(url.lastIndexOf("/") + 1) === "content-reports") {
      setCRpActive("nav-link  active");
    } else if (url.substring(url.lastIndexOf("/") + 1) === "credit-requests") {
      setCRqActive("nav-link active");
    } else if (
      url.substring(url.lastIndexOf("/") + 1) === "withdraw-requests"
    ) {
      setWRActive("nav-link active");
    } else if (url.substring(url.lastIndexOf("/") + 1) === "users") {
      setUsersActive("nav-link active");
    }
  }, [url]);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-info">
        <div className="container-fluid">
          <a className="navbar-brand" href="/admin-panel">
            Ad Watcher Admin
          </a>
          <button
            className="navbar-toggler"
            data-toggle="collapse"
            data-target="#nav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="nav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a
                  className={dashActive}
                  aria-current="page"
                  href="/admin-panel"
                >
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a className={CRpActive} href="/admin-panel/content-reports">
                  Content Reports
                </a>
              </li>
              <li className="nav-item">
                <a className={CRqActive} href="/admin-panel/credit-requests">
                  Credit Requests
                </a>
              </li>
              <li className="nav-item">
                <a className={WRActive} href="/admin-panel/withdraw-requests">
                  Withdraw Requests
                </a>
              </li>
              <li className="nav-item">
                <a className={usersActive} href="/admin-panel/users">
                  Users
                </a>
              </li>
            </ul>
            <form
              className="form-inline ml-auto my-2 my-lg-0"
              onSubmit={() => {
                props.setAuth("");
                props.history.push("/");
              }}
            >
              <button className="btn btn-info " type="submit">
                Log Out
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* <Link to="/NavBarItem">
        <h1>NavBar</h1>
      </Link> */}
    </>
  );
}

export default withRouter(NavBar);
