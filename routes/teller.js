"use strict";
const express = require("express");
const { default: axios } = require('axios');
const Account = require('../models/bankAccount');
let router = express.Router();

router.post('/account/create', (req, res) => {
    console.log("creating account")
    Account.find({ email: `${username}`}).exec((err, result) => {
        if (result.length == 0) {
            let account = new Account({
                email: "test",
                accessToken: req.body.enrollment.accessToken,
                institution: req.body.enrollment.enrollment.institution.name
            });
            account.save();
        } else {
            res.status(406).send("User's can only link one bank accounts.");
        }
    });
});

router.post('/queueSong/:trackId', (req, res) => {

});

module.exports = router;