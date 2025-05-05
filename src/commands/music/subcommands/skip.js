const { getVoiceConnection } = require('@discordjs/voice');
const jam = require("./_player");

module.exports = {
    name: "skip",
    execute: async (interaction) => {
        const player = jam.state[interaction.member.voice.channel.guild.id].player;
        jam.queue[interaction.member.voice.channel.guild.id].shift();
        jam.play_next_in_queue(interaction, player);
        interaction.reply("⏩ Skipped!")
    }
}