const punishmentSchema = require('../../models/punishment-schema')

module.exports = (client) => {
    client.on("guildMemberAdd", async (member) => {
        const result = await punishmentSchema.findOne({
            guildId: member.guild.id,
            userId: member.id,
            type: 'mute',
        })

        if (result) {
            const mutedRole = member.guild.roles.cache.find(
                (role) => role.name === 'Muted'
            )
            if (mutedRole) {
                member.roles.add(mutedRole)
            }
        }
    })

    const check = async () => {
        const query = {
            expires: { $lt: new Date() }
        }
        const results = await punishmentSchema.find(query)
        
        for (const result of results) {
            const { guildId, userId, type } = result
            const guild = await client.guilds.fetch(guildId)
            if (!guild) {
                console.log(`Guild "${guildId}" no longer uses this bot.`)
                continue
            }

            if (type === 'tempban') {
                guild.members.unban(userId, 'Ban expired')
            } else if (type === 'mute') {
                const muteRole = guild.roles.cache.find((role) => role.name === 'Muted')
                if (!muteRole) {
                    console.log(`Guild "${guildId}" has no "Muted" role.`)
                    continue
                }

                const member = guild.members.cache.get(userId)
                if (!member) {
                    continue
                }

                member.roles.remove(muteRole)
            }
        }

        await punishmentSchema.deleteMany(query)

        setInterval(check, 1000*60)
    }
    check()
}

module.exports.config = {
    dbName: 'EXPIRED_PUNISHMENTS',
    displayName: 'Expired Punishments'
}