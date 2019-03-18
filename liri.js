require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require('moment');
var inquirer = require("inquirer");

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
        ]).then(function(response) {
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

    }
    else if (response.userChoice === "movie-this") {

    }
    else if (response.userChoice === "do-what-it-says") {
        
    }
})

