const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const cors = require('cors');
const port = 5000;

require('dotenv').config();

const app = express();
const authRouter = require('./routes/auth');
const spotifyRouter = require('./routes/querySpotify');
const twilioRouter = require('./routes/twilio');

const spotInit = require("./shared/_spotify");
const twilInit = require("./shared/_twilio");
const dbInit = require("./shared/_db");
spotInit.initSpotify();
twilInit.initTwilio();
dbInit.initDb();

app.use(cors());
app.get('/', (req, res) => {
    res.send('Hello World!');
    console.log("HIT");
  });

app.use('/querySpotify', spotifyRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});