const { MessageFlags } = require('discord.js');
const { url_validate, url_download } = require('./_youtube');


module.exports = {
    name: "play",
    execute: async (interaction) => {
        const query = interaction.options.getString('song');
        if (!url_validate(query)) return await interaction.reply({ content: 'Please provide a valid "youtube.com" url', flags: MessageFlags.Ephemeral });

        await interaction.deferReply();
        const file = await url_download(query);
        await interaction.editReply(query);
    }
}