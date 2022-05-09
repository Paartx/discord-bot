module.exports = {
	name: 'delete',
	category: 'Ticket',
	description: 'Delete a ticket.',
	aliases: [],
	permissions: ['ADMINISTRATOR'],
    slash: 'both',
    testOnly: true,
	callback: async ({client, message, interaction, args}) => {
		const bothMessage = message ?? interaction;
		const id = message?.author ?? interaction?.user
		const logchannel = bothMessage.guild.channels.cache.find(channel => channel.name === 'ticket⎯logs');
		if (bothMessage.channel.name.includes('ticket-')) {
			bothMessage.channel.delete();;
			if (logchannel) {
				logchannel.send(`${bothMessage.channel.name} got deleted by ${id}.\n`);
			}
		}
		else {
			bothMessage.reply('You cannot use this command here. Please use this command when you want to delete a ticket.');
			return;
		}
	},
};