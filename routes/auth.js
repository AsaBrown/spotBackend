"use strict";
const express = require("express");
const SpotifyToken = require('../models/token');
const getSpotify = require('../shared/_spotify').getSpotify;

let router = express.Router();
let scopes = ['user-read-private', 'user-read-email','playlist-modify-public','playlist-modify-private', 'user-modify-playback-state'];

router.get('/login', (req,res) => {
    let spotifyApi = getSpotify();
    console.log("Login hit");
    var html = spotifyApi.createAuthorizeURL(scopes);
    res.send(html+"&show_dialog=true");
});

router.get('/callback', async (req,res) => {
    let spotifyApi = getSpotify();
    const { code } = req.query;
    try {
        var data = await spotifyApi.authorizationCodeGrant(code);
        const { access_token, refresh_token } = data.body;
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        var newToken = new SpotifyToken({ authToken: access_token, refreshToken: refresh_token, dateCreated: Date.now() });
        SpotifyToken.deleteMany({}, () => {
            newToken.save();
        });
        res.redirect('http://localhost:3000/home');
    } catch(err) {
        console.log('error in callback');
    }
 });

module.exports = router;