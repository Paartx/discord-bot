module.exports = {
    name: 'kick',
    description: 'Kick people from the server',
    category: 'Moderation',
    permissions: ['KICK_MEMBERS'],

    slash: 'both',
    testOnly: true,

    guildOnly: true,
    
    minArgs: 1,
    expectedArgs: '<user> <reason>',
    options: [
        {
          name: 'user',
          description: 'Specify a user',
          required: true,
          type: 6,
        },
        {
          name: 'reason',
          description: 'Specify a reason',
          required: false,
          type: 3,
        },
      ],

    callback: ({ message, interaction, args }) => {
        const target = message ? 
        message.mentions.members?.first() : 
        interaction.options.getMember('user')
        const id = message?.author?.id ?? interaction?.user
        if (!target) {
            return 'Please mention someone to kick.'
        }

        if (!target.bannable) {
            return {
                custom: true,
                content: `I don't have the permission to kick ${target}`,
                ephemeral: true
            }
        }

        args.shift()
        let reason = args.join(' ')

        if (!reason) {
            reason = 'No reason provided'
        }

        reason = `Kicked by: ${id.username} | Reason: ` + reason 

        target.kick({
            reason
        });

        return {
            custom: true,
            content: `User <@${target.id}> got kicked by ${id} for the reason: ${reason}!`,
            ephemeral: true
        }
    }
}