require('dotenv');
const express = require("express");
const getSpotify = require('../shared/_spotify').getSpotify;
const { default: axios } = require('axios');
const jwt  = require('jsonwebtoken');
const User = require("../models/User.js");
const { urlencoded } = require('body-parser');

let router = express.Router();
router.use(express.json());

router.post('/signUp', (req, res) => {
    console.log('signup hit');
    let username = req.body.username;
    let password = req.body.password;

    User.find({ username: `${username}`}).exec((err, userResult) => {
        console.log(userResult);
        if (userResult.length == 0) {
            let user = new User({
                email: username,
                password: password,
                admin: false
            });
            user.save();
            console.log(user.toJSON());
            const accessToken = jwt.sign(user.toJSON(),
                process.env.JWT_ACCESS_SECRET);
            res.json({accessToken: accessToken });
        } else {
            console.log('user already exists');
            //send responds that username already exists
        }
    });
});

router.post('/login', (req, res) => {
    console.log('site login hit');
    console.log(req.body.username);
    let username = req.body.username;
    let password = req.body.password;
    User.find({username: `${username}`, password: `${password}`}).exec((err, user) => {
        if (user == null) {
            //return user does not exist
        } else {
            console.log(user)
            const accessToken = jwt.sign({user},
                process.env.JWT_ACCESS_SECRET);
            res.json({ accessToken: accessToken });
        }
    });
});

module.exports = router;