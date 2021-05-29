import React from "react";
import { withRouter } from "react-router-dom";

function ConfirmEmail(props) {
  return (
    <div className="container text-center">
      <div className="card mt-5">
        <label className="m-5 display-4 text-light bg-info p-5">
          We have sent an activation link to your google mail, click that link
          to activate your account.
        </label>
      </div>
    </div>
  );
}

export default withRouter(ConfirmEmail);
