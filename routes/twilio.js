"use strict";
const express = require("express");
let router = express.Router();
const { urlencoded } = require('body-parser');
const Contact = require('../models/contact');
const Log = require('../models/log')
const getTwilio = require('../shared/_twilio').getTwilio;
const spotifyFunctions = require('../shared/spotify_functions');

const TWILIO_NUMBER = process.env.TWIL_NUMBER

router.use(urlencoded({extended: false }));

const handleMsg = async (userNumber, msg) => {
    let user = await Contact.findOne({'phone': userNumber});
    if(user === null){
        handleNewUser(userNumber);
    } else if (user.expectName === true) {
        handleNewUserReply(user, userNumber, msg);
    } else if (user.expectSelection === true) {
        handleSongSelection(user, userNumber, msg);
    } else {
        let track = msg.substring(0, msg.indexOf(' by'))
        let artist = msg.substring(msg.indexOf('by') + 3);
        spotifyFunctions.querySongs(track, artist, (result => {
            if(result.length < 1) {
                sendMessage(userNumber, 'No songs found, check your spelling and try again!');
                return;
            }
            let sentMsg = 'Reply with the number corresponding to your chosen song\n';
            result.forEach((item, index) => {
                sentMsg += (index + 1) + ': ' + item.track + ' by ' + item.artist + '\n';
            });
            sendMessage(userNumber, sentMsg);
            user.lastSongQuery = result;
            user.expectSelection = true;
            user.save();
        }));
    }
}

const handleNewUser = (userNumber) => {
    let newContact = new Contact({
        phone: userNumber,
        name: null,
        expectSelection: false,
        expectName: true,
        lastSongQuery: null
    });
    newContact.save().then(() => {
        sendMessage(userNumber, 'Number not recognized, please reply with your name.');
    });
}

const handleNewUserReply = (user, userNumber, msg) => {
    user.name = msg;
    user.expectName = false;
    user.save().then(() => {
        sendMessage(userNumber, 'Contact Saved!');
    });
}

const handleSongSelection = (user, userNumber, msg) => {
    if(user.lastSongQuery != null) {
        if(isNaN(msg) || msg.length > 1){
            sendMessage(userNumber, "Please reply with a single number corresponding to your song selection");
            return;
        }
        spotifyFunctions.queueSong(user.lastSongQuery[parseInt(msg) - 1].trackId, () => {
            sendMessage(userNumber, 'Song Queued!');
            let log = new Log({
                name: user.name,
                action: 'queued ' + user.lastSongQuery[parseInt(msg) - 1].track + ' by ' + user.lastSongQuery[parseInt(msg) - 1].artist,
                createdDate: Date.now(),
                albumArt: user.lastSongQuery[parseInt(msg) - 1].albumArt
            });
            log.save();
            user.expectSelection = false;
            user.lastSongQuery = null;
            user.save();
        });
    }
}

const sendMessage = (userNumber, msg) => {
    let client = getTwilio();
    client.messages.create({
        body: msg,
        to: userNumber,
        from: TWILIO_NUMBER
    })
    .then((message) => console.log('message sent'));
}

router.post('/listen', (req, res) => {
    console.log('twilio hit');
    const userNumber = req.body.From;
    const msg = req.body.Body;
    handleMsg(userNumber, msg);
});

module.exports = router;