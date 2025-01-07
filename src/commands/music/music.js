const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription('Control the music'),
        
    async execute(interaction) {
        await interaction.reply(".");
    }
}