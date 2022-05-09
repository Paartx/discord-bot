const punishmentSchema = require('../../models/punishment-schema')

module.exports = {
    name: 'mute',
    description: 'Mute people from the server',
    category: 'Moderation',
    permissions: ['KICK_MEMBERS'],

    slash: 'both',
    testOnly: true,

    minArgs: 3,
    expectedArgs: '<user> <duration> <reason>',
    options: [
        {
            name: 'user',
            description: 'Specify a user',
            required: true,
            type: 6,
        },
        {
            name: 'duration',
            description: 'Specify a duration',
            required: true,
            type: 3,
        },
        {
            name: 'reason',
            description: 'Specify a reason',
            required: false,
            type: 3,
        },
      ],

      callback: async ({
          args,
          member: staff,
          guild,
          client,
          message,
          interaction,
      }) => {
          if (!guild) {
              return 'You can only use this command inside a server.'
          }

          let userId = args.shift()
          const duration = args.shift()
          let reason = args.join(' ')
          if (!reason) {
              reason = 'No reason provided'
          }
          let user
          if (message) {
              user = message.mentions.users?.first()
          } else {
              user = interaction.options.getUser('user')
          }

        if (!user) {
            userId = userId.replace(/[<@!>]/g, '')
            user = await client.users.fetch(userId)

            if (!user) {
                return `Couldn't find a user with the id "${userid}"`
            }
        }
        reason = `Muted by: ${user.username} | Reason: ` + reason 

        userId = user.id
        let time
        let type
        try {
            const split = duration.match(/\d+|\D+/g)
            time = parseInt(split[0])
            type = split[1].toLowerCase()
        } catch (e) {
            return `Invalid time format! Example format: "10d" where 'd' = days, 'h' = hours and 'm' = minutes.`
        }

        if (type === 'h') {
            time *= 60
        } else if (type === 'd') {
            time *= 60*24
        } else if (type !== 'm') {
            return 'Please use "m", "h", or "d" for minutes, hours and days.'
        }

        const expires = new Date()
        expires.setMinutes(expires.getMinutes() + time)

        const result = await punishmentSchema.findOne({
            guildId: guild.id,
            userId,
            type: 'mute',
        })
        if (result) {
            return `${user} is already muted in this server.`
        }

        try {
            const member = await guild.members.fetch(userId)
            if (member) {
                const muteRole = guild.roles.cache.find((role) => role.name === 'Muted')
                if (!muteRole) {
                    return `This server does not have a "Muted" role.`
                }

                member.roles.add(muteRole)
            }

            await new punishmentSchema({
                userId,
                guildId: guild.id,
                staffId: staff.id,
                reason,
                expires,
                type: 'mute',
            }).save()
        } catch (ignored) {
            return 'Cannot mute that user' + ignored
        }

        return `${user} has been muted for "${duration}"`
      }
}