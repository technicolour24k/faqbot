require('dotenv').config();

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`Logged in as ${client.user.username}!`);
});

client.on('messageCreate', msg => {
     if (msg.content == 'ping') {
        msg.reply(`${msg.content}? Alright, pong!`)
    }
    
    if (msg.mentions.has(client.user.id)) {
        switch (msg.content) {
            case "Fred": 
                msg.reply(`Fred? Freddos? They're expensive now :(`)
                break;
            case "John":
                msg.reply(`John, John, the bakers son. Fell on the floor and landed on a nun`)
                break;
            default:
                    // do something
                } 
            }
            
                if (msg.mentions.has(client.user.id)) {
                    msg.channel.send("Hello there!");
                }
        });

client.login(process.env.TOKEN);