require('dotenv').config();
const { sys } = require('ping');

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

let response;
const debug = false;
let reply; //craft a blank reply to stop us from responding with old reply
let commandList=""; //create a blank command list to populate with questions
const questions = { //the list of things we want to reply to, and how we want to reply
    "pol-0033":"Try turning your computer off, and restarting your router - Take the plug out, leave it for 30 seconds, and then plug it all back in.",
    "test":"You wanna test? That'll be fun!",
    "pancakes":"Let's eat!",
    "omnom":"FEED ME SEYMOUR!"
}

client.on('ready', () => {
    if (!debug) {console.log(`Logged in as tag: ${client.user.tag}!`);}
    if (debug) {console.log(`Logged in as user: ${client.user.username}!`);}
});

client.on('messageCreate', msg => {
    if (debug) {console.log(`Message received: ${msg}`)} //Confirm message received by bot
    message = msg.content;
    if (debug) {console.log(`Message transferred: ${message}`)} //duplicate message into another variable for manipulation
    message.toString();
    if (debug) {console.log(`Message to String: ${message}`)} //switch message to string for lowercase later
    message = message.toLowerCase();
    if (debug) {console.log(`Message to lowercase: ${message}`)} //lowercase message to avoid case sensitive issues in checking messages

    /*make sure we aren't trying to get the bot to reply to it's own message
    because otherwise we end up in infinite loops and that sounds like a square enix sort of grind*/
    if (!msg.author.bot) { 
        response = msgResponse(message);
        if (debug) {console.log(`response: ${response}`)}
        if ((response) || ((!response==="") && (!response==undefined))) //if a response exists then reply with it
            msg.reply(response);
    }
});


client.login(process.env.TOKEN); //prep all this jazz and then log in the bot


function msgResponse(msg) {
    reply = ""
    // Start special handling keywords (e.g. Keyword listing, or server pings)
    if(msg.includes("available keywords")) { //check to see if someone needs help
        for (const [key, value] of Object.entries(questions)) {
            if (commandList == "") {commandList = key} else { //staple together a command list
                commandList = commandList + `, ${key}`;
            }
        }
        reply = `Available keywords: ${commandList}`; //send the reply and break out of the loop
        if (!debug) {console.log(`Available Keyword Reply: ${reply}`)}

    }
    else if (msg.includes("server ping")) {
        let temp = ""
        temp = sys.probe('127.0.0.1', (isAlive) => {
            if (isAlive) {
                // Code if true.
                reply = `https://c.tenor.com/yEEJWgag3_cAAAAd/jim-carrey-its-a-live.gif!`;
                console.log(`Server ping - True!`)
            } else {
                // Code if false.
                reply = `https://c.tenor.com/7937bBKQCxgAAAAC/dead-server.gif`;
                console.log(`Server ping - False :(`)
            }
            if (!debug) {console.log(`Server Ping Reply: ${reply}`)}
        })
        if (temp) {console.log(`External Temp: ${temp}`)}
    }
    //Finish special handling keywords, do a generic loop to check questions const
    else {
        for (const [key, value] of Object.entries(questions)) { //for everything in the "questions" object,
            if (debug) {console.log(`KEY CHECK: ${key}: ${value}`);}
                if (msg.includes(key)) { //if someone's not asking for help, check to see if the message includes one of the question keys
                    reply = `[**Keyword found: ${key}**] ${value}. \n\n*Wrong one? Try saying "available keywords" to see my list of keywords.*` 
                    break;
                }
                if (!debug) {console.log(`Generic For Reply: ${reply}`)}
            }
        }


    if (debug) {console.log(`Function Message: ${msg}`)}
    if (!debug) {console.log(`Final Reply: ${reply}`)}

    if (reply) { return reply; } //if a reply exists (keywords have been found), then send it - otherwise return false
    else { return false; }
}