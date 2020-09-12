const fetch = require("node-fetch");
var btoa = require('btoa');
var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

const clientId = '78138a96f8be4efb8c281170c6350e39';
const clientSecret = '742e4f609ede407baa123d5f777da2a6';
const userID = '06xbtgqsekgeie9m5zz5au179';


const _getToken = async () => {

    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    return data.access_token;
}

const _getGenres = async (token) => {

    const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await result.json();
    return data.categories.items;
}

const _getPlaylistByGenre = async (token, genreId) => {

    const limit = 10;

    const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await result.json();
    return (data.playlists.items);
}

const _getTracks = async (token, tracksEndPoint) => {

    const limit = 10;

    const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await result.json();
    return data.items;
}

const grabTracks = async (token, url) => {

    const limit = 10;

    const result = await fetch(url, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await result.json();
    console.log(data.items);
}


async function getembbedURI(genreid) {
    let token = await _getToken();
    let genres = await _getGenres(token);
    let playlists = await _getPlaylistByGenre(token, genreid);
    return(playlists[0].uri);
    


}

let spotifyURI = getembbedURI('workout')
