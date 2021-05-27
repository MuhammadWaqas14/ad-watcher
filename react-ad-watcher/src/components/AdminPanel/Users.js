import React, { useState, useCallback, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Axios from "axios";

function Users(props) {
  const [users, setUsers] = useState();

  const fetchUser = useCallback(async () => {
    await Axios.get("/api/users/all", {
      headers: {
        Authorization: `${props.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
        props.setAuth("");
        props.history.push("/login");
      });
  }, [props]);

  useEffect(() => {
    if (!users) {
      fetchUser();
    }
  }, [fetchUser, users, props]);

  return (
    <div>
      <h1 className="display-4 text-center m-3">Users</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">User Name</th>
            <th scope="col">Email</th>
            <th scope="col">Phone</th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user) => (
              <tr key={user._id}>
                <th scope="row">{users.indexOf(user) + 1}</th>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.user_name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default withRouter(Users);
