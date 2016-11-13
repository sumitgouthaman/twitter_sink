var Twitter = require('twitter');
var stringify = require('csv-stringify');
var fs = require('fs');
var creds = require("./twitter_auth_keys.json");

if (process.argv.length < 5){
    console.log("Command line arguments not supplied.");
    print_usage();
    process.exit(0);
}

var num_topics = Number(process.argv[2]);
if (process.argv.length != (3 + num_topics + 1)) {
    console.log("Incorrect number of command line arguments!");
    print_usage();
    process.exit(0);
}

var topic_string = process.argv.slice(3, 3 + num_topics).join();
var output_file = process.argv[3 + num_topics];

console.log("Tracking: " + topic_string);
console.log("Output file: " + "/output/" + output_file);

function print_usage(){
    console.log("Sample Usage: ");
    console.log("\tnpm start -- [Number of topics] [Topic1] [Topic2] .. [ Topic3] [Name of output CSV file]");
}

var tweets = 0;
var streamsOpened = 0;
var lastTweet = Date.now();

var client = new Twitter({
    consumer_key: creds.consumer_key,
    consumer_secret: creds.consumer_secret,
    access_token_key: creds.access_token_key,
    access_token_secret: creds.access_token_secret
});

function reopenStream() {
    client.stream('statuses/filter', {
        track: topic_string
    }, function(stream) {
        stream.on('data', function(event) {
            handleTweet(event);
        });

        stream.on('error', function(error) {
            console.log("Error: " + error);
            throw error;
        });
    });
    streamsOpened++;
    console.log("STREAMOPENED #" + streamsOpened + ", Time: " + new Date().toString());
}

function handleTweet(event) {
    var tweet = event && event.text && event.text.replace(/(\r\n|\n|\r)/gm, " ");
    if (tweet && !event.retweeted_status) {
        var id = event.id;
        var lang = event.lang;
        var created_at = event.created_at;
        var verified = event.user.verified;
        var user_screen_name = event.user.screen_name;
        var user_location = event.user.location;
        var user_time_zone = event.user.time_zone;
        var user_lang = event.user.lang;
        var place_country_code = event.place && event.place.country_code;
        var place_full_name = event.place && event.place.full_name;

        stringify([
            [id, created_at, tweet, lang, user_screen_name, verified, user_location, user_time_zone, user_lang, place_country_code, place_full_name]
        ], {
            "quotedString": true
        }, function(err, output) {
            fs.writeFileSync(__dirname + "/output/" + output_file, output, {flag: "a"});
        });
        tweets++;
        lastTweet = Date.now();
    }
}

setInterval(function() {
    console.log("Update: LastTweet at " + new Date(lastTweet).toString() + ", TotalTweets " + tweets);
    var diff = Date.now() - lastTweet;
    if (diff > 10000) // If no data in last 10 seconds reopen stream
        reopenStream();
}, 5000)

stringify([
            ["id", "created_at", "tweet", "lang", "user_screen_name", "verified", "user_location", "user_time_zone", "user_lang", "place_country_code", "place_full_name"]
        ], {
            "quotedString": true
        }, function(err, output) {
            fs.writeFileSync(__dirname + "/output/twitter.csv", output, {flag: "w"});
        });

reopenStream();