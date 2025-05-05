const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: "loop",
    execute: async (interaction) => {
        const connection = getVoiceConnection(interaction.member.voice.channel.guild.id);
        connection.destroy();
        interaction.reply("💨 *poof*")
    }
}