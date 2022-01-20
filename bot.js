// Run dotenv
require('dotenv').config();

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', msg => {
    // switch (msg) {
    //     case 'ping':
    //         bot.sendMessage({
    //             to: channelID,
    //             message: 'Pong!'})
    //     case 'nom':
    //         bot.sendMessage({
    //             to: channelID,
    //             message: 'Eating!'
    //         })
    //     break;
    // }
    if (msg.content === 'ping') {
       msg.reply('Pongo!');
     }
  });



client.login(process.env.TOKEN);