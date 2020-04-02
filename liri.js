require("dotenv").config();
var keys = require("./keys.js");
var request = require("request");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var fs = require("fs");

var movieThis = function(movie) {
  if (!movie) {
    movie = "Mr.+Nobody";
  }
  var queryUrl =
    "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
  request(queryUrl, function(err, response, body) {
    if (!err && response.statusCode === 200) {
      var movieInfo = JSON.parse(body);
      outputData("-----------------------------------------------------");
      outputData("Title: " + movieInfo.Title);
      outputData("Release year: " + movieInfo.Year);
      outputData("IMDB Rating: " + movieInfo.imdbRating);
      outputData("Rotten Tomatoes Rating: " + movieInfo.Ratings[1].Value);
      outputData("Country: " + movieInfo.Country);
      outputData("Language: " + movieInfo.Language);
      outputData("Plot: " + movieInfo.Plot);
      outputData("Actors: " + movieInfo.Actors);
      outputData("-----------------------------------------------------");
    }
  });
};

var concertThis = function(artist) {
  var region = "";
  var queryUrl =
    "https://rest.bandsintown.com/artists/" +
    artist.replace(" ", "+") +
    "/events?app_id=codingbootcamp";

  request(queryUrl, function(err, response, body) {
    if (!err && response.statusCode === 200) {
      var concertInfo = JSON.parse(body);
      outputData(artist + " concert information:");

      for (i = 0; i < 3; i++) {
        region = concertInfo[i].venue.region;
        outputData("-----------------------------------------------------");
        outputData("Location: " + concertInfo[i].venue.city + ", " + region);

        outputData("Venue: " + concertInfo[i].venue.name);

        outputData(
          "Date: " + moment(concertInfo[i].datetime).format("MM/DD/YYYY")
        );
        outputData("-----------------------------------------------------");
      }
    }
  });
};

var spotifyThisSong = function(song) {
  if (!song) {
    song = "The Sign Ace of Base";
  }

  var spotify = new Spotify(keys.spotify);
  spotify.search(
    {
      type: "track",
      query: song,
      limit: 1
    },
    function(err, data) {
      if (err) {
        return console.log(err);
      }

      var songInfo = data.tracks.items[0];
      outputData("-----------------------------------------------------");
      outputData(songInfo.artists[0].name);
      outputData(songInfo.name);
      outputData(songInfo.album.name);
      outputData(songInfo.preview_url);
      outputData("-----------------------------------------------------");
    }
  );
};

var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }

    var dataArray = data.split(",");
    runAction(dataArray[0], dataArray[1]);
  });
};

var outputData = function(data) {
  console.log(data);

  fs.appendFile("log.txt", "\r\n" + data, function(err) {
    if (err) {
      return console.log(err);
    }
  });
};

var runAction = function(func, parm) {
  switch (func) {
    case "concert-this":
      concertThis(parm);
      break;
    case "spotify-this-song":
      spotifyThisSong(parm);
      break;
    case "movie-this":
      movieThis(parm);
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
    default:
      outputData("That is not a command that I recognize, please try again.");
  }
};

runAction(process.argv[2], process.argv[3]);
