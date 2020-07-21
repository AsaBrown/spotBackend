"use strict";
const express = require("express");
const getSpotify = require('../shared/_spotify').getSpotify;
const SpotifyToken = require('../models/token');

async function refreshMyToken(token){
    let spotifyApi = getSpotify();
    spotifyApi.setRefreshToken(token.refreshToken);
    spotifyApi.refreshAccessToken()
    .then(data => {
        console.log(data.body);
        SpotifyToken.deleteMany({}, () => {
            let newToken = new SpotifyToken({ authToken: data.body.access_token, refreshToken: token.refreshToken, dateCreated: Date.now() });
            spotifyApi.setAccessToken(token);
            newToken.save();
        });
    },
    err => {
        console.log(err);
    });
}

async function validateAuth(req, res, next){
    let spotifyApi = getSpotify();
    try {
        //local token variable has not been set
        const newToken = await SpotifyToken.findOne();
        //No token found in DB
        if(newToken === null ) {
            console.log('Sending Unauthorized Status, must auth Spotify');
            res.sendStatus(401);
        } else {
            let oldDate = new Date(newToken.dateCreated);
            let currentDate = new Date(Date.now());
            let ONE_HOUR = 60 * 59 * 1000;
            if(currentDate - oldDate < ONE_HOUR) {
                spotifyApi.setAccessToken(newToken.authToken);
                spotifyApi.setRefreshToken(newToken.refreshToken);
                next();
            } else {
                console.log('Existing token is expired, refreshing');
                await refreshMyToken(newToken);
                next();
            }
        }
    } catch(err) {
        console.log(err);
    }
}

module.exports = {
    refreshMyToken,
    validateAuth
}