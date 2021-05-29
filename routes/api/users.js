const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;
const validateSignUpInput = require("../../validation/signup");
const validateLoginInput = require("../../validation/login");
const passport = require("passport");
const User = require("../../models/User");
const { sendConfirmationEmail } = require("../../mailer");

router.post("/signup", (req, res) => {
  const { errors, isValid } = validateSignUpInput(req.body);
  const { first_name, last_name, user_name, email, phone, password } = req.body;
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ $or: [{ email }, { user_name }] }).then((user) => {
    if (user) {
      if (user.email === email)
        return res.status(400).json({ email: "Email already exists" });
      else
        return res.status(400).json({ user_name: "Username already exists" });
    } else {
      const newUser = new User({
        first_name,
        last_name,
        user_name,
        email,
        phone,
        password,
      });
      // hashing password before storing it in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          sendConfirmationEmail({
            toUser: newUser,
            hash: newUser._id,
          });
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) =>
              console.log({ error: "Error creating a new user" })
            );
        });
      });
    }
  });
});
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { email, password } = req.body;

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ email: "Email not found" });
    }
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: user.id,
          user_name: user.user_name,
        };
        jwt.sign(payload, SECRET, { expiresIn: 3600 }, (err, token) => {
          if (err) {
            console.log(err);
          }
          return res.json({
            success: true,
            token: `Bearer ${token}`,
          });
        });
      } else {
        return res.status(400).json({ password: "Password Incorrect" });
      }
    });
  });
});

router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.find({})
      .then((users) => res.status(200).json(users))
      .catch((err) => res.status(400).json({ user: "Error fetching users" }));
  }
);
router.get("/user/:id", (req, res) => {
  User.find({})
    .then((user) => res.status(200).json(user))
    .catch((err) => res.status(400).json({ user: "Error fetching user" }));
});
router.get("/activate/user/:hash", (req, res) => {
  console.log("data request:", req.params);
  const _id = req.params.hash;

  User.findOne({ _id }).then((user) => {
    console.log("ID", _id);
    if (!user) {
      return res.status(404).json({ ID: "User not Found" });
    }
    if (user) {
      const payload = {
        id: user.id,
        user_name: user.user_name,
      };
      jwt.sign(payload, SECRET, { expiresIn: 3600 }, (err, token) => {
        if (err) {
          console.log(err);
        }
        console.log(res);
        return res.json({
          success: true,
          token: `Bearer ${token}`,
        });
      });
    } else {
      return res.status(400).json({ message: "Cannot Activate" });
    }
  });
});
module.exports = router;
