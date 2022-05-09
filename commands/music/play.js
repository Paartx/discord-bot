module.exports = {
    name: 'play',
    description: 'Plays a song in the voice channel',
    category: 'Music',
    permissions: [],

    slash: 'both',
    testOnly: true,

    guildOnly: true,
    
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: '<song>',
    options: [
        {
          name: 'song',
          description: 'Play a given song name/URL in the voice channel',
          required: true,
          type: 3,
        },
      ],

callback: async ({ message, interaction, channel, args }) => {
		
        /* This will get the song that has been provided */
        const bothMessage = message ?? interaction
        let providedSong = args.join(' ')
        const song = bothMessage.options.getString(providedSong);
        const id = message?.author ?? interaction?.user

        /* Gets the voice channel where the member is in. If the member isn't in any, return. */
        const voiceChannel = interaction.member.voice.channel;
        if(!voiceChannel) return {
            custom: true,
            content: 'You need to be in a voice channel!',
            ephemeral: true
        }

        /* Get more info about how the play command works at https://npmjs.com/package/@koenie06/discord.js-music#play */
        music.play({
            interaction: bothMessage,
            channel: voiceChannel,
            song: song
        });

	},
};