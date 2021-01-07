const express = require("express");
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

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server Started on port ${port}`));
