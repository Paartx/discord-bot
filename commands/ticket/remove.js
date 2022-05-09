module.exports = {
	name: 'remove',
	category: 'Ticket',
	description: 'Removes a member from a ticket.',
	aliases: [],
	permissions: ['ADMINISTRATOR'],
    slash: 'both',
    testOnly: true,
    minArgs: 1,
	maxArgs: 1,
    expectedArgs: '<user>',
	callback: async ({client, message, interaction, args, prefix}) => {
		const bothMessage = message ?? interaction
		if (bothMessage.channel.name.includes('ticket-')) {
			const member = bothMessage.mentions.members.first() || bothMessage.guild.members.cache.get(args[0]) || bothMessage.guild.members.cache.find(x => x.user.username === args.slice(0).join(' ') || x.user.username === args[0]);
			if (!member) {
				return bothMessage.channel.send(`Incorrect Usage! Correct Usage:${prefix}remove <member>`);
			}
			try{
				bothMessage.channel.permissionOverwrites.edit(member.user, { 
					VIEW_CHANNEL: false,
					SEND_MESSAGES: false,
					ATTACH_FILES: false,
					READ_MESSAGE_HISTORY: false,
				}).then(() => {
					bothMessage.channel.send(`Successfully removed ${member} from ${bothMessage.channel}`);
				});
			}
			catch(e) {
				bothMessage.channel.send('An error occurred, please try again!');
                console.log('An error occured while trying to remove (remove.js) someone from a ticket' + e);
				return;
			}
		}
	},
};