const { MessageFlags } = require('discord.js');
const youtube = require('./_youtube');
const jam = require("./_player");

module.exports = {
    name: "play",
    execute: async (interaction) => {
        const query = interaction.options.getString('song');
        if (youtube.id_from_url(query) == null) return await interaction.reply({ content: '⚠️ Please provide a valid YouTube url.', flags: MessageFlags.Ephemeral });
        console.log("[JAM] /play:", query);

        //---   Queue or Play   ---//
        jam.add_to_queue(interaction, query);
        interaction.reply("Added to the queue!");
        if (jam.get_queue(interaction).length > 1) return;

        //---   Play   ---//
        await jam.create_player(interaction);
    }
}