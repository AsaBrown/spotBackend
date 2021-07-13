"use strict";
const express = require("express");
const getSpotify = require('../shared/_spotify').getSpotify;
const { default: axios } = require('axios');
const util = require('util')

const playSong = (trackId) => {
    let spotifyApi = getSpotify();
    let jsonData = {
        uris: ["spotify:track:" + trackId]
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
}

const queueSong = (trackId, callback) => {
    let spotifyApi = getSpotify();
    axios({
        method: 'post',
        url: 'https://api.spotify.com/v1/me/player/queue?uri=spotify:track:' + trackId,
        headers: {
            'Authorization': 'Bearer ' + spotifyApi.getAccessToken(),
            'Content-Type': 'application/json'
        }
    }).then(res => {
        console.log('Queue Song Response Status: ' + res.status);
    }).catch(e => {
        console.log(e);
    })
    .then(callback);
}

const querySongs = async (track, artist, callback) => {
    console.log("QUERY HIT");
    let spotifyApi = getSpotify();
    spotifyApi.searchTracks('track:' + track + ' artist:' + artist)
    .then((data) => {
        let items = data.body.tracks.items;
        let returnList = [];
        for(var i = 0; i < items.length; i++){
            let item = items[i];
            let returnItem = {track: item.name, trackId: item.id, artist: item.artists[0].name, albumArt: item.album.images[2].url}
            returnList.push(returnItem);
        }
        return returnList;
    }, function(err) {
    console.log('Something went wrong!', err);
    })
    .then(callback);
}

module.exports = {
    querySongs,
    playSong,
    queueSong
}


