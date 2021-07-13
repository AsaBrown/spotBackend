let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let tokenSchema = new Schema({
    authToken: String,
    refreshToken: String,
    dateCreated: Date
});

const SpotifyToken = mongoose.model('SpotifyToken', tokenSchema);

module.exports = SpotifyToken;