const { SlashCommandBuilder } = require('discord.js');

const subcommands = [
    require('./subcommands/play')
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription('Control the music')
        .addSubcommand(subcommand => subcommand
            .setName('play')
            .setDescription('Play a song')
            .addStringOption(option => option.setName('song')
                .setDescription('URL or search query')
                .setRequired(true))),
        
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        for (const i in subcommands) {
            if (subcommand === subcommands[i].name) {
                return subcommands[i].execute(interaction);
            }
        }

        require('./subcommands/play')(interaction);
    }
}