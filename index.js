const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const cors = require('cors');
const port = process.env.WEBSITES_PORT || process.env.PORT || 8080;
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();
const spotifyAuthRouter = require('./routes/spotifyAuth');
const spotifyRouter = require('./routes/querySpotify');
const twilioRouter = require('./routes/twilio');
const authRouter = require('./routes/auth');

const spotInit = require("./shared/_spotify");
const twilInit = require("./shared/_twilio");
const dbInit = require("./shared/_db");
const { MediaContext } = require('twilio/lib/rest/api/v2010/account/message/media');

spotInit.initSpotify();
twilInit.initTwilio();
dbInit.initDb();

app.use(cors());
app.get('/', (req, res) => {
    res.send('Hello World!');
    console.log("HIT");
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});

function authenticateToken(req, res, next) {
    console.log('Authenticating Token');
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
    });
}

app.use('/querySpotify', spotifyRouter);
app.use('/auth', spotifyAuthRouter);
app.use('/authentication', authRouter);



