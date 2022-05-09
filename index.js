const Discord = require('discord.js')
const { Intents } = Discord
const WOKCommands = require('wokcommands')
const path = require('path')
const mongoose = require('mongoose')
require('dotenv/config')
const { prefix } = process.env.PREFIX


const client = new Discord.Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Intents.FLAGS.GUILD_MEMBERS,
    ],
  })

client.on('ready', () => {

    // OWN COMMAND HANDLER
    // let handler = require('./command-handler')
    // if (handler.default) handler = handler.default

    // handler(client)

    const wok = new WOKCommands(client, {
        commandsDir: path.join(__dirname, 'commands'),
        featuresDir: path.join(__dirname, 'features'),
        testServers: ['969957658318745610'],
        delErrMsgCooldown: 5,
        ephemeral: true,
        botOwners: ['786198910094934056', '714892519627948032'],
        disabledDefaultCommands: [
          // 'help',
          // 'command',
          // 'language',
          // 'prefix',
          // 'requiredrole',
          // 'channelonly'
      ],
        mongoUri: process.env.MONGO_URI,
        dbOpions: {
          keepAlive: true
        }
    }).setCategorySettings([
      {
          // You can change the default emojis as well
          // "Configuration" is ⚙ by default
          name: 'Configuration',
          emoji: '🚧',
          hidden: true
      },
      {
        name: 'Moderation',
        emoji: '🔨',
      },
      {
      name: 'Ticket',
      emoji: '📩',
      },
      {
        name: 'Music',
        emoji: '🎶',
      },
  ])
    .setDefaultPrefix(process.env.PREFIX)
    .setColor(0x000000)


    const { slashCommands } = wok
}) 

client.login(process.env.TOKEN)
