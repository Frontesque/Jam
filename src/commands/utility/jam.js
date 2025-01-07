const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const package = require('../../../package.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jam')
        .setDescription('Information about the Jam instance'),

    async execute(interaction) {
        const jam_information_embed = new EmbedBuilder()
        .setColor(process.env.PRIMARY_COLOR)
        .setTitle('Jam')
        .setURL('https://github.com/frontesque/jam')
        .setDescription('A self-contained Discord music bot')
        .addFields(
            { name: 'Version', value: package.version },
        )
        await interaction.reply({ embeds: [ jam_information_embed ] });
    }
}