const { MessageFlags } = require('discord.js');
const { url_validate, url_download_ogg } = require('./_youtube');
const jam = require("./_player");

const { generateDependencyReport } = require('@discordjs/voice');

module.exports = {
    name: "play",
    execute: async (interaction) => {
        const query = interaction.options.getString('song');
        if (!url_validate(query)) return await interaction.reply({ content: 'Please provide a valid "youtube.com" url', flags: MessageFlags.Ephemeral });
        
        //---   Download   ---//
        await interaction.deferReply();
        const file = await url_download_ogg(query);
        await interaction.editReply(query);

        //---   Play   ---//
        jam.join_voice_if_required(interaction);
        await new Promise(r => setTimeout(r, 500));
        await jam.create_player(interaction, file);

    }
}