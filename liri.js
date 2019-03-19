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
                name: "userInput"
            }
        ]).then(concertThis)

    }
    else if (response.userChoice === "spotify-this-song") {
        inquirer.prompt([
            {
                type: "input",
                message: "What song would you like to know about?",
                name: "userInput"
            }
        ]).then(spotifyThisSong)
    }
    else if (response.userChoice === "movie-this") {
        inquirer.prompt([
            {
                type: "input",
                message: "What movie would you like to know about? ",
                name: "userInput"
            }
        ]).then(movieThis)
    }
    else if (response.userChoice === "do-what-it-says") {
        fs.readFile("random.txt", "utf8", function (error, data) {
            if (error) {
                return console.log(error);
            }
            var dataArr = data.split(",");
            readFromFile(dataArr);
        });
    }
})

function readFromFile(dataArr) {
    console.log(dataArr);
    var fileInput = {};
    fileInput.userInput = dataArr[1];
    if (dataArr[0] === "movie-this") {
        movieThis(fileInput);
    }
    else if (dataArr[0] === "concert-this") {
        concertThis(fileInput);
    }
    else if (dataArr[0] === "spotify-this-song") {
        spotifyThisSong(fileInput);
    }
}

function movieThis (response) {
    if (response.userInput.trim() === "") {
        response.userInput = "Mr. Nobody";
    }
    axios.get("http://www.omdbapi.com/?t=" + response.userInput + "&y=&plot=short&apikey=trilogy").then(function (response) {
        console.log("Title: " + response.data.Title);
        console.log("Released: " + moment().format("YYYY", response.data.Released));
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
}

function spotifyThisSong(response) {
    if (response.userInput.trim() === "") {
        response.userInput = "The Sign Ace of Base";
    }
    spotify.search({ type: 'track', query: response.userInput, limit: 1 }, function (err, data) {
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
}

function concertThis(response) {
    axios.get("https://rest.bandsintown.com/artists/" + response.userInput + "/events?app_id=codingbootcamp").then(function (response) {
        for (i in response.data) {
            console.log(response.data[i].venue.name);
            console.log(response.data[i].venue.city + ", " + response.data[i].venue.country);
            console.log(moment().format("MM/DD/YYYY", response.data[i].datetime));
            console.log("-------------------------------------------");
        }
    })
}