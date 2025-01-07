const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, NoSubscriberBehavior, createAudioResource, StreamType } = require('@discordjs/voice');
const fs = require("fs");

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

function create_player(interaction, source) {;
    //---   Create Connection & Player   ---//
    const connection = getVoiceConnection(interaction.member.voice.channel.guild.id);
    const player = createAudioPlayer({
        behaviors: { noSubscriber: NoSubscriberBehavior.Stop, },
    });

    //---   Make Audio Resource   ---//
    console.log("[JAM]", "Playing:", source);
    const resource = createAudioResource(fs.createReadStream(source), {
        inputType: StreamType.OggOpus,
    });
    //---   Play In Channel   ---//
    player.play(resource);
    connection.subscribe(player);

    while (true) {
        console.log(connection._state.status);
    }
}

module.exports = {
    join_voice,
    create_player,
}