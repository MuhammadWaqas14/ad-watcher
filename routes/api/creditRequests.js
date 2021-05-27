const express = require("express");
const router = express.Router();
const CreditRequests = require("../../models/CreditRequest");
const passport = require("passport");
const validateCreditRequestInput = require("../../validation/creditRequest");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    CreditRequests.find({})
      .then((creditRequests) => res.status(200).json(creditRequests))
      .catch((err) =>
        res.status(400).json({ user: "Error fetching credit requests" })
      );
  }
);

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user_id = req.user.user_name;

    const creditRequest = req.body;
    const { errors, isValid } = validateCreditRequestInput(creditRequest);
    if (!isValid) {
      return res.json(errors).status(400);
    }
    creditRequest.user_id = user_id;
    const newCreditRequest = new CreditRequests(creditRequest);
    newCreditRequest
      .save()
      .then((doc) => res.json(doc))
      .catch((err) =>
        console.log({ create: "Error creating new request" }, err)
      );
  }
);

router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    CreditRequests.findOneAndDelete({ _id: req.params.id })
      .then((doc) => res.status(200).json(doc))
      .catch((err) =>
        res.status(400).json({ delete: "Error deleting request" })
      );
  }
);

module.exports = router;
