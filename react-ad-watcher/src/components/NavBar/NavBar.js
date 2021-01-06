import React from "react";
import { Link } from "react-router-dom";
function NavBar() {
  return (
    <div>
      <Link to="/NavBarItem">
        <h1>NavBar</h1>
      </Link>
    </div>
  );
}

export default NavBar;
