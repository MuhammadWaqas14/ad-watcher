import React, { useCallback, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Axios from "axios";

function EmailConfirmed(props) {
  const url = window.location.pathname;
  const id = url.substring(url.lastIndexOf("/") + 1);

  const confirmUser = useCallback(async () => {
    await Axios.get(`/api/users/activate/user/${id}`)
      .then((res) => {
        console.log(res);
        props.setAuth(res.data.token);
        props.history.push("/home");
      })
      .catch((err) => {});
  }, [id, props]);

  useEffect(() => {
    confirmUser();
  }, [confirmUser, props]);

  return (
    <div className="container text-center">
      <div className="card mt-5">
        <label className="m-5 display-4 text-light bg-info p-5">
          Email Confirmed, redirecting...
        </label>
      </div>
    </div>
  );
}

export default withRouter(EmailConfirmed);
