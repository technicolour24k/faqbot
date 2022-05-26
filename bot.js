require('dotenv').config();
const { tcpPingPort } = require("tcp-ping-port")



const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

let reply; //craft a blank reply to stop us from responding with old reply
let response;
const debug = false;
let commandList="**server status**"; //create a blank command list to populate with questions array
let commandListCreated = false
const questions = { //the list of things we want to reply to, and how we want to reply
    "pol-0033":"Try turning your computer off, and restarting your router - Take the plug out, leave it for 30 seconds, and then plug it all back in.",
    "test":"You wanna test? That'll be fun!",
    "pancakes":"Let's eat!",
    "omnom":"FEED ME SEYMOUR!"
}

const pingHosts = {
    "NS Wiki": {address: "nocturnalsouls.net", port:80},
    "NS Members Portal":{address: "members.nocturnalsouls.net", port:80},
    "Login Server":{address: "connect.nocturnalsouls.net", port:22100}
    };


client.on('ready', () => {
    if (debug) {console.log(`Logged in as tag: ${client.user.tag}!`);}
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

        // Start special handling keywords (e.g. Keyword listing, or server pings)
        if(message.includes("keywords")) { //check to see if someone needs help
            if (!commandListCreated) {
                for (const [key] of Object.entries(questions)) {
                    if ((commandList == "")) {commandList = key} else { //staple together a command list
                        commandList = commandList + `, ${key}`;
                    }
                }
                commandListCreated = true
            }
            response = `Available keywords: ${commandList}`; //send the reply and break out of the loop
            if (debug) {console.log(`Available Keyword Reply: ${response}`)}
        }
        else if ((message.includes("server status")) || (message.includes("server down")) || (message.includes("server up"))) {        
            for (const [key, host] of Object.entries(pingHosts)) { //for everything in the "pingHosts" object,
                tcpPingPort(host.address, host.port)
                    .then(function (res) {
                        console.log(res)
                        if (res.online) {
                            response = `${key} is up!`
                            if (debug){
                                console.log (`${key} is alive`)
                                consolve.log(`${key} resolves to ${res.numeric_host}`)
                            }
                        }
                        else if (res.online == false) {
                            response = `${key} is down!`
                            if (debug){
                                console.log (`${key} is dead`)
                                consolve.log(`${key} resolves to ${res.numeric_host}`)
                            }
                        }
                        else {
                            response = "ERROR: Cannot reconcile server. This should not happen. Contact your server admin."
                            console.log("I'm very confused, it's Schrodingers Server!")
                        }
                        msg.reply(response);
                    });
                }}
        //Finish special keywords, do a generic loop to check questions const
        else {
            for (const [key, value] of Object.entries(questions)) { //for everything in the "questions" object,
                if (debug) {console.log(`KEY CHECK: ${key}: ${value}`);}
                    if (message.includes(key)) { //if someone's not asking for help, check to see if the message includes one of the question keys
                        response = `[**Keyword found: ${key}**] ${value}. \n\n*Wrong one? Try saying "available keywords" to see my list of keywords.*` 
                        break;
                    }
                    if (debug) {console.log(`Generic For response: ${response}`)}
                }
            }

        if (debug) {console.log(`Function Message: ${msg}`)}
        if (debug) {console.log(`Final response: ${response}`)}

        if (debug) {console.log(`response: ${response}`)}
        if ((response) || ((!response==="") && (!response==undefined))) //if a response exists then reply with it
            msg.reply(response);
        }
        response = null //blank the response again for safety
});

client.login(process.env.TOKEN); //prep all this jazz and then log in the bot