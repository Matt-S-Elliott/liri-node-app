require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require('moment');
var inquirer = require("inquirer");
var fs = require("fs");

inquirer.prompt([
    {
        type: "list",
        message: "What would you like to do?",
        name: "userChoice",
        choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"]
    }
]).then(function (response) {
    if (response.userChoice === "concert-this") {
        inquirer.prompt([
            {
                type: "input",
                message: "What band would you like to see?",
                name: "artist"
            }
        ]).then(function (response) {
            axios.get("https://rest.bandsintown.com/artists/" + response.artist + "/events?app_id=codingbootcamp").then(function (response) {
                for (i in response.data) {
                    console.log(response.data[i].venue.name);
                    console.log(response.data[i].venue.city + ", " + response.data[i].venue.country);
                    console.log(moment().format("MM/DD/YYYY", response.data[i].datetime));
                    console.log("-------------------------------------------");
                }
            })
        })

    }
    else if (response.userChoice === "spotify-this-song") {
        inquirer.prompt([
            {
                type: "input",
                message: "What song would you like to know about?",
                name: "song"
            }
        ]).then(function (response) {
            if (response.song.trim() === "") {
                response.song = "The Sign Ace of Base";
            }
            spotify.search({ type: 'track', query: response.song, limit: 1 }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
                var artists = [];
                for (i in data.tracks.items[0].artists) {
                    artists.push(data.tracks.items[0].artists[i].name);
                }
                console.log("Artist(s): " + artists.join(", "));
                console.log("Title: " + data.tracks.items[0].name);
                console.log("Spotify Link: " + data.tracks.items[0].external_urls.spotify);
                console.log("Album: " + data.tracks.items[0].album.name);
            });
        })
    }
    else if (response.userChoice === "movie-this") {
        inquirer.prompt([
            {
                type: "input",
                message: "What movie would you like to know about? ",
                name: "movie"
            }
        ]).then(function(response) {
            if (response.movie.trim() === "") {
                response.movie = "Mr. Nobody";
            }
            axios.get("http://www.omdbapi.com/?t=" + response.movie + "&y=&plot=short&apikey=trilogy").then(function(response) {
            console.log("Title: " + response.data.Title);
            console.log("Released: " + moment().format("YYYY",response.data.Released));
            for (i in response.data.Ratings) {
                if (response.data.Ratings[i].Source === "Rotten Tomatoes") {
                    console.log("Rotten Tomatoes Rank: " + response.data.Ratings[i].Value);
                }
            }
            console.log("Country: " + response.data.Country);
            console.log("Languages: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);

            })
        })
    }
    else if (response.userChoice === "do-what-it-says") {
        fs.readFile("random.txt", "utf8", function(error, data) {
            if (error) {
              return console.log(error);
            }
            var dataArr = data.split(",");
            console.log(dataArr);
          });
    }
})

