const { MessageFlags } = require('discord.js');
const { url_validate, url_download_ogg, file_in_cache } = require('./_youtube');
const jam = require("./_player");

module.exports = {
    name: "play",
    execute: async (interaction) => {
        const query = interaction.options.getString('song');
        if (!url_validate(query)) return await interaction.reply({ content: 'Please provide a valid "youtube.com" url', flags: MessageFlags.Ephemeral });
        console.log("[JAM] /play:", query);

        //---   Download or Get From Cache   ---//
        await interaction.deferReply();
        let file;
        const is_file_in_cache = file_in_cache(query)
        if (is_file_in_cache) {
            file = is_file_in_cache;
        } else {
            file = await url_download_ogg(query);
        }
        await interaction.editReply(query);
        //---   Play   ---//
        jam.join_voice_if_required(interaction);
        await new Promise(r => setTimeout(r, 500));
        await jam.create_player(interaction, file);
    }
}