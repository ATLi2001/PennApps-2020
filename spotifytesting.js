const fetch = require("node-fetch");

var token = "BQAB6Z_fQguHqINSsIjjOL9CeYTyhp-9Sli8PikN9JnM-ztRCA2D1Otw_ZzsHPCNGc-0T63_nnWl0mS2HnaPUcWqo3szWM-06E2Y9eWIo6BcyILjP7EEAqbXyJM_bTfQN5uxM-7kppoqKnXNRA8T27-em6gCzHOYPh4CrlcRYFqGdacIWQ"
// const _getGenres = async (token) => {

//     const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
//         method: 'GET',
//         headers: { 'Authorization' : 'Bearer ' + token}
//     });

//     const data = await result.json();
//     console.log(data.categories.items);
// }

const _getPlaylistByGenre = async (token, genreId) => {

    const limit = 10;
    
    const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });

    const data = await result.json();
    console.log(data.playlists.items);
}

_getPlaylistByGenre(token, "workout");