import React from "react";
import { withRouter } from "react-router-dom";
function NavBar(props) {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/admin-panel">
            Ad Watcher Admin
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="/admin-panel">
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
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
              className="d-flex"
              onSubmit={() => {
                props.setAuth("");
                props.history.push("/");
              }}
            >
              <button className="btn btn-outline-success" type="submit">
                Log Out
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* <Link to="/NavBarItem">
        <h1>NavBar</h1>
      </Link> */}
    </div>
  );
}

export default withRouter(NavBar);
