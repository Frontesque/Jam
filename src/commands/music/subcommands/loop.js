const jam = require("./_player");

module.exports = {
    name: "loop",
    execute: async (interaction) => {
        if (jam.state[interaction.member.voice.channel.guild.id].loop == true) {
            jam.state[interaction.member.voice.channel.guild.id].loop = false;
            interaction.reply("▶️ Loop Disabled!")
        } else {
            jam.state[interaction.member.voice.channel.guild.id].loop = true;
            interaction.reply("🔂 Loop Enabled!")
        }
    }
}