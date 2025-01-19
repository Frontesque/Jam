const { SlashCommandBuilder } = require('discord.js');

const subcommands = [
    require('./subcommands/play'),
    require('./subcommands/stop'),
    require('./subcommands/queue'),
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
                .setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName('stop')
                .setDescription('Stop the music and leave the voice channel'))
        .addSubcommand(subcommand => subcommand
            .setName('queue')
                .setDescription('See the songs in your queue')),
        
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