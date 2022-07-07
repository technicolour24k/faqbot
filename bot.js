require('dotenv').config();
const { tcpPingPort } = require("tcp-ping-port")
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const debug = false;

let response;
let hostDown = false
let hostNotChecked = true
let commandList="**server status**"; //create a blank command list to populate with questions array
let commandListCreated = false
const questions = { //the list of things we want to reply to, and how we want to reply
    "pol-0033":"Try turning your computer off, and restarting your router - Take the plug out, leave it for 30 seconds, and then plug it all back in.",
    "test":"You wanna test? That'll be fun!",
    "pancakes":"Let's eat!",
    "omnom":"FEED ME SEYMOUR!"
}

const pingHosts = {
    "NS Sites": {
        // "NS Wiki": {address: "nocturnalsouls.net", port:80},
        // "NS Members Portal":{address: "members.nocturnalsouls.net", port:80}
    },
    
    "Login Servers": {
        "Login Server - Data":{address: "test", port:54001},
        "Login Server - Auth":{address: "test", port:54230},
        "Login Server - View":{address: "test", port:54231},
    },

    "Zone Servers": {
        // "West Ronfaure":{address:"123.234.345.456", port:12345},
        // "East Ronfaure":{address:"123.234.345.456", port:12345},
        // "Ghelsba Outpost":{address:"123.234.345.456", port:12345},
        // "West Saruta":{address:"123.234.345.456", port:12345},
        // "East Saruta":{address:"123.234.345.456", port:12345},
        // "Giddeus":{address:"123.234.345.456", port:12345},
    }
};


client.on('ready', () => {
    console.log(`Logged in as tag: ${client.user.tag}!`);
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
            response = `If you don't hear back, everything's good!`
            msg.reply(response)     
            response =""
            /********************************************************************************************************************************
             * ********************************************** Cycle through Web based server states *****************************************
             ********************************************************************************************************************************/
            for (const [key, host] of Object.entries(pingHosts['NS Sites'])) { //for everything in the "Web" object,
                tcpPingPort(host.address, host.port)
                    .then(function (res) {
                        console.log(res)
                        if (res.online) {
                            if (debug){
                                console.log (`${key} is alive`)
                                console.log(`${key} resolves to ${res.host}(${res.ip}):${host.port}`)
                            }
                        }
                        else if (res.online == false) {
                            response = `${key} is down!`
                            if (debug){
                                console.log (`${key} is dead`)
                                console.log(`${key} resolves to ${res.host}(${res.ip}):${host.port}`)
                            }
                        }
                        else {
                            response = `ERROR: Cannot reconcile server. This should not happen. Contact your server admin.`
                            console.log(`I'm very confused, it's Schrodingers Server!`)
                        }
                        msg.reply(response);
                    });
                }
            
            /********************************************************************************************************************************
             * ************************************************ Cycle through Login server states *******************************************
             ********************************************************************************************************************************/
            for (const [key, host] of Object.entries(pingHosts['Login Servers'])) {
                tcpPingPort(host.address, host.port)
                    .then(function (res) {
                        console.log(res)
                        console.log(`${res.host} - ${hostDown}. ${hostNotChecked}`)
                        if (res.online) {
                            if (debug){
                                console.log (`${key} is alive`)
                                console.log(`${key} resolves to ${res.host}(${res.ip}):${host.port}`)
                            }
                        }
                        else if (res.online == false) {
                            hostDown = true
                            if (debug){
                                console.log (`${key} is dead`)
                                console.log(`${key} resolves to ${res.host}(${res.ip}):${host.port}`)
                            }
                        }
                        else {
                            response = `ERROR: Cannot reconcile server. This should not happen. Contact your server admin.`
                            console.log(`I'm very confused, it's Schrodingers Server!`)
                        }
                        if ((hostDown) && (hostNotChecked)) {response = `Login server is struggling - hold up.`}
                        msg.reply(response); 
                        hostNotChecked = false
                    });
                }

            /********************************************************************************************************************************
             * ***************************************** Cycle through In-Game Zone server states *******************************************
             ********************************************************************************************************************************/
            for (const [key, host] of Object.entries(pingHosts['Zone Servers'])) {
                tcpPingPort(host.address, host.port)
                    .then(function (res) {
                        console.log(res)
                        if (res.online) {
                            if (!debug){
                                console.log (`${key} is alive`)
                                console.log(`${key} resolves to ${res.host}(${res.ip}):${host.port}`)
                            }
                        }
                        else if (res.online == false) {
                            if (debug){
                                console.log (`${key} is dead`)
                                console.log(`${key} resolves to ${res.host}(${res.ip}):${host.port}`)
                            }
                            response = `${key} server is struggling - hold up.`
                        }
                        else {
                            response = `ERROR: Cannot reconcile server. This should not happen. Contact your server admin.`
                            console.log(`I'm very confused, it's Schrodingers Server!`)
                        }
                        msg.reply(response);
                    });
                }

        }
        //Finish special keywords, do a generic loop to check questions const
        else {
            for (const [key, value] of Object.entries(questions)) { //for everything in the "questions" object,
                if (debug) {console.log(`KEY CHECK: ${key}: ${value}`);}
                    if (message.includes(key)) { //if someone's not asking for help, check to see if the message includes one of the question keys
                        response = `[**Keyword found: ${key}**] ${value}. \n\n*Wrong one? Try saying "keywords" to see my list of available keywords.*` 
                        break;
                    }
                    if (debug) {console.log(`Generic "questions" For response: ${response}`)}
                }
            } 

        if (debug) {console.log(`Final response: ${response}`)}
        if ((response) || ((!response==="") && (!response==undefined))) //if a response exists then reply with it
            msg.reply(response);
        }
        response = null //blank the response again for safety, otherwise.. LOOPS!
});

client.login(process.env.TOKEN); //prep all this jazz and then log in the bot