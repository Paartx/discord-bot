module.exports = {
    name: 'ban',
    description: 'Ban people from the server',
    category: 'Moderation',
    permissions: ['BAN_MEMBERS'],

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
        const id = message?.author ?? interaction?.user
        console.log(target)
        if (!target) {
            return 'Please mention someone to ban.'
        }

        if (!target.bannable) {
            return {
                custom: true,
                content: `I don't have the permission to ban ${target}`,
                ephemeral: true
            }
        }

        args.shift()
        let reason = args.join(' ')

        if (!reason) {
            reason = 'No reason provided'
        }

        reason = `Banned by: ${id.username} | Reason: ` + reason 

        target.ban({
            reason,
            days: 7
        });

        return {
            custom: true,
            content: `User <@${target.id}> got banned by ${id} for the reason: ${reason}!`,
            ephemeral: true
        }
    }
}