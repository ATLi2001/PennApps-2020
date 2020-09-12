const fetch = require("node-fetch");
var btoa = require('btoa');

const clientId = '78138a96f8be4efb8c281170c6350e39';
const clientSecret = '742e4f609ede407baa123d5f777da2a6';

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

const _getPlaylistByGenre = async (token, genreId) => {
    console.log(token)

    const limit = 10;

    const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await result.json();
    console.log(data.playlists.items);
}

async function main() {
    let token = await _getToken();
    await _getPlaylistByGenre(token, "workout");


}

main();
