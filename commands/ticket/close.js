const sourcebin = require('sourcebin_js');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const { Collection } = Discord;
Collection.prototype.array = function() {
	return [...this.values()]
}

module.exports = {
	name: 'close',
	category: 'Ticket',
	description: 'Closes the ticket.',
	aliases: [],
	permissions: [],
    slash: 'both',
    testOnly: true,
	callback: async ({client, message, interaction, args}) => {
		const bothMessage = message ?? interaction
		const id = message?.author ?? interaction?.user
		if (bothMessage.channel.name.includes('ticket-')) {
			const member = bothMessage.guild.members.cache.get(bothMessage.channel.name.split('ticket-').join(''));
			if (bothMessage.member.permissions.has('ADMINISTRATOR') || bothMessage.channel.name === `ticket-${id.id}`) {
				const logchannel = bothMessage.guild.channels.cache.find(channel => channel.name === 'ticket⎯logs');
				bothMessage.channel.messages.fetch().then(async (messages) => {
					const output = messages.array().reverse().map(m => `${new Date(m.createdAt).toLocaleString('en-US')} - ${m.author.tag}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`).join('\n');

					let response;
					try {
						response = await sourcebin.create([
							{
								name: ' ',
								content: output,
								languageId: 'text',
							},
						], {
							title: `Chat transcript for ${bothMessage.channel.name}`,
							description: `Ticket created by ${member.user.tag}`,
						});
					}
					catch(e) {
						bothMessage.channel.send('An error occurred trying to create the transcript, please try again!') 
						console.log(`An error occured while trying to create a transcript for a ticket ${e}`);
						return;
					}

                    const embed = new Discord.MessageEmbed()
                        .setTitle(`Transcript ${bothMessage.channel.name}`)
						.setDescription(`[\`📄 View\`](${response.url})`)
						.setColor('GREEN')
                        .setThumbnail('https://i.imgur.com/3ZfTlEE.png')
                        .setFooter({
                            text: "Waffle's SMP Bot"
                        });
					bothMessage.reply('Here is a transcript of your ticket, please click the link below to view the transcript');
                    bothMessage.channel.send({ embeds: [embed] });
					logchannel.send(`${bothMessage.channel.name} (<#${bothMessage.channel.id}>) got closed by ${id}.\nTranscript: <${response.url}>\n`);
				}).then(() => {
					try {
                        bothMessage.channel.permissionOverwrites.edit(member.user, { 
							VIEW_CHANNEL: false,
							SEND_MESSAGES: false,
							ATTACH_FILES: false,
							READ_MESSAGE_HISTORY: false,
						}).then(() => {
							bothMessage.channel.send(`Successfully closed ${bothMessage.channel}`);
						});
					}
					catch(e) {
						bothMessage.channel.send('An error occurred, please try again!');
                        console.log('An error occured while trying to remove someone (close.js) from a ticket' + e);
						return;
					}
				});
			}
		}
		else {
			bothMessage.reply('You cannot use this command here. Please use this command in a ticket channel.');
			return;
		}
	},
};