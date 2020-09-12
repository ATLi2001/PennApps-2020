var SpotifyWebApi = require('spotify-web-api-node');
const fetch = require("node-fetch");
var btoa = require('btoa');
var express = require('express')
var app = express()
var request = require('request'); // "Request" library
var querystring = require('querystring');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId: '78138a96f8be4efb8c281170c6350e39',
    clientSecret: '742e4f609ede407baa123d5f777da2a6',
});


app.get('/login', async function (req, res) {
    // your application requests authorization
    // var scope = 'playlist-modify-public playlist-modify-private';
    let link = await authorizeplaylists();
    res.redirect(link);

});

app.get('/callback', async function (req, res) {
    res.send("hello world");
    let token = await _getToken();
    console.log(token)
    spotifyApi.setAccessToken(token)
    await spotifyApi.createPlaylist(userID, "My testing playlist", { public: false }).then(
        function (data) {
            console.log(data);
        },
        function (err) {
            console.log(err);
        }
    );

});

const userID = '06xbtgqsekgeie9m5zz5au179';

const _getToken = async () => {

    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa('78138a96f8be4efb8c281170c6350e39:742e4f609ede407baa123d5f777da2a6')
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    return data.access_token;
}

async function main() {
    let token = await _getToken();
    console.log(token)
    spotifyApi.setAccessToken(token)
    await spotifyApi.searchPlaylists('workout').then(
        function (data) {
            console.log("playlists are: ", data.body);
        },
        function (err) {
            console.log(err);
        }
    );
    // await spotifyApi.createPlaylist(userID, "My testing playlist", { public: false }).then(
    //     function (data) {
    //         console.log(data);
    //     },
    //     function (err) {
    //         console.log(err);
    //     }
    // );
}
// gives authentication link
async function authorizeplaylists() {
    var scopes = ['playlist-read-private', 'playlist-modify-private', 'playlist-modify-public'],
        redirectUri = 'http://localhost:8888/callback',
        clientId = '5fe01282e44241328a84e7c5cc169165',
        state = 'some-state-of-my-choice';

    // Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
    var spotifyApi = new SpotifyWebApi({
        redirectUri: "http://localhost:8888/callback",
        clientId: "78138a96f8be4efb8c281170c6350e39"
    });

    // Create the authorization URL
    var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

    // https://accounts.spotify.com:443/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice
    return (authorizeURL);
}

app.listen(8888, () => {
    console.log(`Server is listening on port 8888`);
});

