const SpotifyWebApi = require('spotify-web-api-node');

let spotifyApi;

const initSpotify = () => {
    spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOT_CLIENT_ID,
        clientSecret: process.env.SPOT_CLIENT_SECRET,
        redirectUri: 'http://localhost:5000/auth/callback/'
        });
    console.log('SPOT CONNECTED');
}

const getSpotify = () => {
    if(spotifyApi){
        return spotifyApi;
    }
}

const setAccessToken = (token) => {
    spotifyApi.setAccessToken(token);
}

const setRefreshToken = (token) => {
    spotifyApi.setRefreshToken(token);
}

module.exports = {
    initSpotify,
    getSpotify, 
    setAccessToken,
    setRefreshToken
};