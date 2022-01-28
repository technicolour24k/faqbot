require('dotenv').config();

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

let response;
const debug = true;

client.on('ready', () => {
    if (debug) {console.log(`Logged in as tag: ${client.user.tag}!`);}
    if (debug) {console.log(`Logged in as user: ${client.user.username}!`);}
});

client.on('messageCreate', msg => {
    if (debug) {console.log(`Message received: ${msg}`)}
    message = msg.content;
    if (debug) {console.log(`Message transferred: ${message}`)}
    message.toString();
    if (debug) {console.log(`Message to String: ${message}`)}
    message = message.toLowerCase();
    if (debug) {console.log(`Message to lowercase: ${message}`)}

    if (!msg.author.bot) {
        response = msgResponse(message);
        if (debug) {console.log(`response: ${response}`)}
        if ((response) || ((!response==="") && (!response==undefined)))
            msg.reply(response);
    }
});


client.login(process.env.TOKEN);

function msgResponse(msg) {
    let reply = "";
    let commandList = "";
    const questions = {
        "pol-0033":"Try turning your computer off, and restarting your router - Take the plug out, leave it for 30 seconds, and then plug it all back in.",
        "test":"You wanna test? That'll be fun!",
        "pancakes":"Let's eat!"
    }

    for (const [key, value] of Object.entries(questions)) {
        if (debug) {console.log(`KEY CHECK: ${key}: ${value}`);}

        
        if(msg.includes("available keywords")) {
            for (const [key, value] of Object.entries(questions)) {
                if (commandList == "") {commandList = key} else {
                    commandList = commandList + `, ${key}`;
                }
            }
            reply = `Available keywords: ${commandList}`;
            break;
        }
        else if (msg.includes(key)) {
            if (debug) {console.log(`KEY CHECK2: ${key}: ${value}`);}
            reply = `[**Keyword found: ${key}**] ${value}.
*Wrong one? Try saying "available keywords" to see my list of keywords.*`
            break;
        }
      }

    if (debug) {console.log(`Function Message: ${msg}`)}
    if (debug) {console.log(`Function Reply: ${reply}`)}

    if (reply) { return reply; }
    else { return false; }
}