import React from "react";
import { withRouter } from "react-router-dom";
function NavBar(props) {
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
                <a className="nav-link" aria-current="page" href="/admin-panel">
                  Dashboard
                </a>
              </li>
              <li className="nav-item active">
                <a className="nav-link" href="/admin-panel/content-reports">
                  Content Reports
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/admin-panel/credit-requests">
                  Credit Requests
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/admin-panel/withdraw-requests">
                  Withdraw Requests
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/admin-panel/users">
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
