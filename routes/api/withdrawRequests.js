const express = require("express");
const router = express.Router();
const WithdrawRequests = require("../../models/WithdrawRequest");
const passport = require("passport");
const validateWithdrawRequestInput = require("../../validation/withdrawRequest");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    WithdrawRequests.find({})
      .then((withdrawRequests) => res.status(200).json(withdrawRequests))
      .catch((err) =>
        res.status(400).json({ user: "Error fetching withdarwrequests" })
      );
  }
);

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user_id = req.user.user_name;

    const withdrawRequest = req.body;
    const { errors, isValid } = validateWithdrawRequestInput(withdrawRequest);
    if (!isValid) {
      return res.json(errors).status(400);
    }
    withdrawRequest.user_id = user_id;
    const newWithdrawRequest = new WithdrawRequests(withdrawRequest);
    newWithdrawRequest
      .save()
      .then((doc) => res.json(doc))
      .catch((err) =>
        console.log({ create: "Error creating new request" }, err)
      );
  }
);

module.exports = router;
