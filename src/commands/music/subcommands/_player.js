const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, NoSubscriberBehavior, createAudioResource, StreamType } = require('@discordjs/voice');
const fs = require("fs");

function join_voice(interaction) {
    const channel = interaction.member.voice.channel;
    if (!channel) {
        interaction.reply('You need to join a voice channel first!');
        return false;
    };
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });
    
    connection.on('stateChange', (oldState, newState) => {
        console.log(`[Connection] "${oldState.status}" -> "${newState.status}"`);
        if (newState.status === "disconnected") connection.destroy(); // Destroys the connection when the bot is disconnected
    });

    return true;
}

function join_voice_if_required(interaction) {
    if (getVoiceConnection(interaction.member.voice.channel.guild.id)) {
        return true // Connection already exists for this server
    };
    return join_voice(interaction); // Create new connection for this server
}

function create_player(interaction, source) {
    //---   Get Connection   ---//
    const connection = getVoiceConnection(interaction.member.voice.channel.guild.id);

    //---   Create Player   ---//
    const player = createAudioPlayer({
        behaviors: { noSubscriber: NoSubscriberBehavior.Stop, },
    });

    player.on('stateChange', (oldState, newState) => {
        console.log(`[Player] "${oldState.status}" -> "${newState.status}"`);
    });
    player.on('error', err => console.log(err));
    connection.on('error', err => console.log(err));

    //---   Make Audio Resource   ---//
    console.log("[JAM]", "Playing:", source);
    
    connection.subscribe(player);
    const resource = createAudioResource(fs.createReadStream(source), { inputType: StreamType.OggOpus });
    //---   Play In Channel   ---//
    player.play(resource);
}

module.exports = {
    join_voice,
    join_voice_if_required,
    create_player,
}