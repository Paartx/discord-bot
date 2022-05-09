const sourcebin = require('sourcebin_js');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const { Collection } = Discord;
Collection.prototype.array = function() {
	return [...this.values()]
}

module.exports = {
	name: 'transcript',
	category: 'Ticket',
	description: 'Transcripts a specified ticket.',
	aliases: [],
	permissions: [],
    slash: 'both',
    testOnly: true,
	callback: async ({client, message, interaction, args}) => {
		const bothMessage = message ?? interaction
		if (bothMessage.channel.name.includes('ticket-')) {
			if (bothMessage.member.permissions.has('ADMINISTRATOR') || bothMessage.channel.name === `ticket-${bothMessage.author.id}`) {
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
							description: "Created by Paartx#8822",
						});
					}
					catch(e) {
						bothMessage.channel.send('An error occurred, please try again!');
                        console.log('An error occured while trying to create a transcript for a ticket' + e);
						return;
					}

                    const embed = new Discord.MessageEmbed()
                        .setTitle('Transcript')
						.setDescription(`[\`📄 View\`](${response.url})`)
						.setColor('GREEN')
                        .setThumbnail('https://i.imgur.com/3ZfTlEE.png')
                        .setFooter({
                            text: "Waffle's SMP Bot"
                        });
					bothMessage.reply('Here is a transcript of your ticket, please click the link below to view the transcript');
                    bothMessage.channel.send({ embeds: [embed] });
				});
			}
		}
		else {
				bothMessage.channel.send('You cannot use this command here. Please use this command in a open ticket.'); 
                return;
		}
	},
};