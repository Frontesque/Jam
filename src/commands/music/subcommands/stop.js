const jam = require("./_player");
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: "stop",
    execute: async (interaction) => {
        const connection = getVoiceConnection(interaction.member.voice.channel.guild.id);
        connection.destroy();
        jam.state[interaction.member.voice.channel.guild.id] = null;
        interaction.reply("💨 *poof*")
    }
}