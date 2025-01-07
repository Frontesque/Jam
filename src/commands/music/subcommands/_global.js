const { joinVoiceChannel } = require('@discordjs/voice');

function join_voice() {
    return joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });
}

module.exports = {
    join_voice,
}