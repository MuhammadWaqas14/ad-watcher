const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

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

app.use(fileUpload());
app.post(
  "/upload",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.files === null) {
      return res.status(400).json({ msg: "No File Uploaded" });
    }
    temp = file.mimetype.indexOf("image");
    if (temp === -1) {
      return res.status(400).json({ msg: "Upload a correct file" });
    }
    const file = req.files.file;
    var str = file.name;
    var nameF;
    for (let i = 0; i < str.length; i++) {
      nameF = str.replace(" ", "");
    }

    file.mv(`${__dirname}/react-ad-watcher/public/uploads/${nameF}`, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send();
      }
      res.json({
        fileName: nameF,
        filePath: `/uploads/${nameF}`,
        fileType: `${file.mimetype}`,
      });
    });
  }
);
app.use("/api/posts/", require("./routes/api/posts"));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server Started on port ${port}`));
