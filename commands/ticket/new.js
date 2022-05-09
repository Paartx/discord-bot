const Discord = require('discord.js')

module.exports = {
	name: 'new',
	category: 'Ticket',
	description: 'Creates a new ticket.',
	aliases: [],
	permissions: [],
    slash: 'both',
    testOnly: true,
    callback: async ({message, interaction, args, client, prefix}) => {
		const bothMessage = message ?? interaction
		const id = message?.author ?? interaction?.user
		let cate = bothMessage.guild.channels.cache.find(
			(c) => c.name === "tickets" && c.type === "GUILD_CATEGORY")
		  if (!cate) {
			  bothMessage.channel.send('category not found')
			  return;
		  }
		if (bothMessage.guild.channels.cache.get(channel => channel.name === `ticket-${id.id}`)) {
			return bothMessage.reply('You already have a ticket, please close your existing ticket first before opening a new one!');
		}

		let madeChannel = bothMessage.guild.channels.create(`ticket-${id.id}`, {
			permissionOverwrites: [
				{
					id: id.id,
					allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
				},
				{
					id: bothMessage.guild.roles.everyone,
					deny: ['VIEW_CHANNEL'],
				},
			],
			type: 'text',
		}).then(channel=> channel.setParent(cate)).then(async channel => {
		

			bothMessage.reply(`You have successfully created a ticket! Please click on ${channel} to view your ticket.`);
			channel.send(`Hi ${id}, welcome to your ticket! Please be patient, we will be with you shortly. If you would like to close this ticket please run \`${prefix}close\``);
			const logchannel = bothMessage.guild.channels.cache.find(channel => channel.name === 'ticket⎯logs');
			if (logchannel) {
				logchannel.send(`ticket-${id.id} created by ${id}. Click the following to view <#${channel.id}>\n`);
			}
		});
	},
};