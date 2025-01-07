const { MessageFlags } = require('discord.js');
const { url_validate, url_download_mp3 } = require('./_youtube');
const jam = require("./_global");

module.exports = {
    name: "play",
    execute: async (interaction) => {
        const query = interaction.options.getString('song');
        if (!url_validate(query)) return await interaction.reply({ content: 'Please provide a valid "youtube.com" url', flags: MessageFlags.Ephemeral });
        
        //---   Join Call & Setup Audio   ---//
        const vc = await jam.join_voice(interaction);
        if (vc === false) return;

        // const player = await jam.create_player(interaction);
        
        //---   Download   ---//
        await interaction.deferReply();
        const file = await url_download_mp3(query);
        await interaction.editReply(query);
    }
}