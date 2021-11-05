require('dotenv');
const express = require("express");
const { promisify } = require('util');
const { default: axios } = require('axios');
const jwt  = require('jsonwebtoken');
const User = require("../models/User.js");
const { urlencoded } = require('body-parser');
const bcrypt = require('bcrypt');

let router = express.Router();
router.use(express.json());

router.post('/signUp', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    User.find({ email: `${username}`}).exec((err, userResult) => {
        if (userResult.length == 0) {
            let user = new User({
                email: username,
                password: password,
                admin: false
            });
            user.save();
            user.password = "";
            const accessToken = jwt.sign(user.toJSON(),
                process.env.JWT_ACCESS_SECRET);
            res.json({accessToken: accessToken });
        } else {
            res.status(406).send("Username already exists");
        }
    });
});

router.post('/login', async (req, res) => {
    console.log(req.body.username);
    let username = req.body.username;
    let password = req.body.password;
    console.log(`${username} is attempting login...`)
    User.findOne({email: `${username}`}).exec(async (err, user) => {
        if (user ==  null || user == undefined) {
            res.status(404).send("User not found with specified username");
        } else {
            if (await User.isValidPassword(password, user.password)) {
                let d = new Date();
                d.setDate(d.getDate() + 30);
                user.password = "";
                const accessToken = jwt.sign({user}, process.env.JWT_ACCESS_SECRET);
                res.cookie('jwt', accessToken, {
                    expires: d, 
                    httpOnly: true,
                    secure: true, 
                    sameSite: 'none'
                });

                res.status(200).json({
                    status: 'success',
                    accessToken,
                    data: {
                        user
                    }
                });
            } else {
                res.status(401).send("Invalid Password");
            }
        }
    });
});

router.get('/checkUser', async (req, res) => {
    let user;
    if(req.cookies.jwt) {
        const token = req.cookies.jwt;
        jwt.verify(token, process.env.JWT_ACCESS_SECRET, async (err, verfiedJWT) => {
            if(err) {
                return res.status(401).send("JWT is invalid");
            }
            user = await User.findById(verfiedJWT.user._id);
            res.status(200).send({myUser: user});
        });
    } else {
        user = null;
        res.status(200).send(null);
    }
});

module.exports = router;