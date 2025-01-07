const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, NoSubscriberBehavior   } = require('@discordjs/voice');

function join_voice(interaction) {
    const channel = interaction.member.voice.channel;
    if (!channel) {
        interaction.reply('You need to join a voice channel first!');
        return false;
    };
    joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });
    return true;
}

function create_player(interaction) {
    const channel = interaction.member.voice.channel;
    const player = createAudioPlayer({
        behaviors: { noSubscriber: NoSubscriberBehavior.Stop, },
    });


}

module.exports = {
    join_voice,
    create_player,
}