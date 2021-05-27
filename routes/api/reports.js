const express = require("express");
const router = express.Router();
const Report = require("../../models/Reports");
const passport = require("passport");
const validateReportInput = require("../../validation/report");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Report.find()
      .then((reports) => res.status(200).json(reports))
      .catch((err) => res.status(400).json({ user: "Error fetching reports" }));
  }
);

router.post(
  "/create/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user_id = req.user.user_name;
    const report = req.body;
    const { errors, isValid } = validateReportInput(report);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    report.user_id = user_id;
    const newReport = new Report(report);
    newReport
      .save()
      .then((doc) => res.json(doc))
      .catch((err) =>
        console.log({ create: "Error creating new Report" }, err)
      );
  }
);
router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Report.findOneAndDelete({ _id: req.params.id })
      .then((doc) => res.status(200).json(doc))
      .catch((err) =>
        res.status(400).json({ delete: "Error deleting report" })
      );
  }
);

module.exports = router;
