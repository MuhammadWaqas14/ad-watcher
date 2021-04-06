const express = require("express");
const path = require("path");
require("dotenv").config();
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
//Load Config
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

connectDB();

const passport = require("passport");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/users/", require("./routes/api/users"));
app.use(passport.initialize());
require("./middleware/passport")(passport);

app.use("/api/posts/", require("./routes/api/posts"));
app.use("/api/wallets/", require("./routes/api/wallets"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("react-ad-watcher/build"));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "react-ad-watcher", "build", "index.html")
    );
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server Started on port ${port}`));
