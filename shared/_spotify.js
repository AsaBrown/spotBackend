const SpotifyWebApi = require('spotify-web-api-node');

let spotifyApi;

const initSpotify = () => {
    spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOT_CLIENT_ID,
        clientSecret: process.env.SPOT_CLIENT_SECRET,
        redirectUri: `${process.env.FRONTEND_URL}/auth/callback/`
        });
    console.log('SPOTIFY CONNECTED');
}

const getSpotify = () => {
    if(spotifyApi) { 
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