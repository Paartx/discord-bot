const punishmentSchema = require('../../models/punishment-schema')

module.exports = {
    name: 'tempban',
    description: 'Ban people temporary from the server',
    category: 'Moderation',
    permissions: ['BAN_MEMBERS'],

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
            type: 'tempban',
        })
        if (result) {
            return `${user} is already banned in this server.`
        }

        try {
            await guild.members.ban(userId, {days: 7, reason })

            await new punishmentSchema({
                userId,
                guildId: guild.id,
                staffId: staff.id,
                reason,
                expires,
                type: 'tempban',
            }).save()
        } catch (ignored) {
            return `I don't have the permission to ban that user.`
        }

        return `${user} has been banned for ${duration} for the reason ${reason}`
      }
}