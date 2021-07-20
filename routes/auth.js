const express = require("express");
const getSpotify = require('../shared/_spotify').getSpotify;
const { default: axios } = require('axios');
const jwt  = require('jsonwebtokens');
const User = require("../models/User.js");

let router = express.Router();

router.get('/signUp', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let userResult = User.find({ username: `${username}`});
    if (userResult == null) {
        let user = new User({
            username: username, 
            password: password,
        });
    } else {
        //send responds that username already exists
    }

});