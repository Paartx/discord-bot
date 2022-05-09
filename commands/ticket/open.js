module.exports = {
	name: 'open',
	category: 'Ticket',
	description: 'Re-opens a ticket.',
	aliases: [],
	permissions: ['ADMINISTRATOR'],
    slash: 'both',
    testOnly: true,
	callback: async ({client, message, interaction, args}) => {
		const bothMessage = message ?? interaction
		const id = message?.author ?? interaction?.user
		const logchannel = bothMessage.guild.channels.cache.find(channel => channel.name === 'ticket⎯logs');
		if (bothMessage.channel.name.includes('ticket-')) {
			const member = bothMessage.guild.members.cache.get(bothMessage.channel.name.split('ticket-').join(''));
			logchannel.send(`${bothMessage.channel.name} (<#${bothMessage.channel.id}>) got opened by ${id}.\n`);
			try {
                bothMessage.channel.permissionOverwrites.edit(member.user, { 
					VIEW_CHANNEL: true,
					SEND_MESSAGES: true,
					ATTACH_FILES: true,
					READ_MESSAGE_HISTORY: true,
				})
					.then(() => {
						bothMessage.reply(`Successfully re-opened ${bothMessage.channel}`);
					});
			}
			catch (e) {
				bothMessage.channel.send('An error occurred, please try again!');
                console.log('An error occured while trying to open a ticket ' + e);
				return;
			}
		}
		else {
			bothMessage.reply('You cannot use this command here. Please use this command on a closed ticket.',);
			return;
		}
	},
};