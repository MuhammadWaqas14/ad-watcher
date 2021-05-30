const express = require("express");
const router = express.Router();
const Wallet = require("../../models/Wallet");
const passport = require("passport");
const validateWalletInput = require("../../validation/wallet");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Wallet.find({ user_id: req.user.user_name })
      .then((wallets) => res.status(200).json(wallets))
      .catch((err) =>
        res
          .status(400)
          .json({ user: "Error fetching wallet of logged in user" })
      );
  }
);

router.get(
  "/:username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Wallet.find({ user_id: req.params.username })
      .then((wallets) => res.status(200).json(wallets))
      .catch((err) =>
        res.status(400).json({ user: "Error fetching wallet of user" })
      );
  }
);

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user_id = req.user.user_name;

    const wallet = req.body;
    const { errors, isValid } = validateWalletInput(wallet);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    wallet.user_id = user_id;
    const newWallet = new Wallet(wallet);
    newWallet
      .save()
      .then((doc) => res.json(doc))
      .catch((err) => console.log({ create: "Error creating new post" }, err));
  }
);

router.patch(
  "/update/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user_id = req.user.user_name;
    const { errors, isValid } = validateWalletInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const { credits, total_trans } = req.body;
    Wallet.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { credits, total_trans } },
      { new: true }
    )
      .then((doc) => res.status(200).json(doc))
      .catch((err) =>
        res.status(400).json({ update: "Error updating Wallet" })
      );
  }
);

module.exports = router;
