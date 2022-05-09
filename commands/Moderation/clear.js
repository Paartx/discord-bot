module.exports = {
    name: 'clear',
    description: 'Clear messages from your server.',
    category: 'Moderation',
    permissions: ['MANAGE_MESSAGES'],

    slash: 'both',
    testOnly: true,

    guildOnly: true,
    
    minArgs: 1,
    maxArgs: 2,
    expectedArgs: '<amount> <type>',
    options: [
        {
          name: 'amount',
          description: 'Specify an amount',
          required: true,
          type: 10,
        },
        {
          name: 'type',
          description: 'Specify a type',
          required: false,
          type: 3,
          choices: [
              {
                  name: "Bulk Delete",
                  value: "bulkDelete"
              },
              {
                  name: "Fetch Delete",
                  value: "fetchDelete",
              }
          ]
        },
      ],
    
    callback: async ({ message, interaction, channel, args }) => {
        const amount = parseInt(args.shift())
        let type = args.join(' ')
        const bothMessage = message ?? interaction
        let reply = 'Deleted specified message(s).'

        if (!type) {
            type = 'bulkDelete'
        }

        if (message) {
            await message.delete()
        }

        if (type){
            if (type === "fetchDelete") {
                const messages = await channel.messages.fetch({ limit: amount })
                const { size } = messages
                reply = `Deleted ${size} message(s).`
        
                messages.forEach((message) => message.delete())
        
            } else {
                const { size } = await channel.bulkDelete(amount, true)
                reply = `Deleted ${size} message(s).`
            }
        }

        

        // Bulk delete
        // const { size } = await channel.bulkDelete(amount, true)

        // Fetch and delete
        // const messages = await channel.messages.fetch({ limit: amount })
        // const { size } = messages

        // messages.forEach((message) => message.delete())


        if (interaction) {
            return {
                custom: true,
                content: reply,
                ephemeral: true
            }
        }

        channel.send(reply)
    }
}