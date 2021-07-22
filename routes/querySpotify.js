"use strict";
const express = require("express");
const getSpotify = require('../shared/_spotify').getSpotify;
const { default: axios } = require('axios');
const Log = require('../models/log');

let router = express.Router();

router.get('/queueSong/:trackId', (req, res) => {
    let spotifyApi = getSpotify();
    axios({
        method: 'post',
        url: 'https://api.spotify.com/v1/me/player/queue?uri=spotify:track:' + req.params.trackId,
        headers: {
            'Authorization': 'Bearer ' + spotifyApi.getAccessToken(),
            'Content-Type': 'application/json'
        }
    }).then(res => {
        console.log('Queue Song Response Status: ' + res.status);
    }).catch(e => {
        console.log(e);
    });
});

router.get('/playSong/:trackId', (req, res) => {
    let spotifyApi = getSpotify();
    let jsonData = {
        uris: ["spotify:track:" + req.params.trackId]
    }
    axios({
        method: 'put',
        url: 'https://api.spotify.com/v1/me/player/play',
        data: jsonData,
        dataType: 'json',
        headers: {
            'Authorization': 'Bearer ' + spotifyApi.getAccessToken(),
            'Content-Type': 'application/json'
        }
    }).then(res => {
        console.log(res.response.statusText);
    }).catch(e => {
        console.log(e.response.statusText);
    });
});

router.get('/querySongs/:artist/:track', (req, res) => {
    console.log("QUERYING SONGS");
    let spotifyApi = getSpotify();
    console.log('received query ');
    spotifyApi.searchTracks('track:' + req.params.track + ' artist:' + req.params.artist, {limit: 7})
    .then(function(data) {
        let items = data.body.tracks.items;
        let returnList = [];
        for(var i = 0; i < items.length; i++){
            let item = items[i];
            let returnItem = {songName:item.name, songId:item.id, songArtist:item.artists[0].name}
            returnList.push(returnItem);
        }
        res.json(returnList);
    }, function(err) {
    console.log('Something went wrong!', err);
    });
});

router.get('/queryLogs', (req, res) => {
    Log.find().sort({ createdDate: -1 }).limit(10).exec((err, result) => {
        res.json(result);
    });
});

module.exports = router;