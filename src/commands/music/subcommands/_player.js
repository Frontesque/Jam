const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, NoSubscriberBehavior, createAudioResource, StreamType } = require('@discordjs/voice');
const youtube = require('./_youtube');
const fs = require("fs");

let queue = {};

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
    connection.on('error', err => {
        console.log("[Connection]", err);
        connection.destroy();
    });

    return true;
}

function leave(interaction) {
    const connection = getVoiceConnection(interaction.member.voice.channel.guild.id);
    connection.destroy();
}

function join_voice_if_required(interaction) {
    if (getVoiceConnection(interaction.member.voice.channel.guild.id)) {
        return true // Connection already exists for this server
    };
    return join_voice(interaction); // Create new connection for this server
}

function play_from_file(player, source_file) {
    console.log("[JAM]", "Playing:", source_file);
    const resource = createAudioResource(fs.createReadStream(source_file), { inputType: StreamType.OggOpus });
    player.play(resource);
}

async function play_next_in_queue(interaction, player) {
    const server_queue = get_queue(interaction);
    if (server_queue.length == 0) {
        interaction.channel.send(`👋 Queue ended, bye!`);
        return leave(interaction)
    };
    const next_song = server_queue[0];
    const file = await youtube.download_or_cached(next_song);
    interaction.channel.send(`Playing: ${next_song}`);
    play_from_file(player, file);
}

async function create_player(interaction) {
    //---   Get Connection   ---//
    join_voice_if_required(interaction);
    await new Promise(r => setTimeout(r, 500));
    const connection = getVoiceConnection(interaction.member.voice.channel.guild.id);

    //---   Create Player   ---//
    const player = createAudioPlayer({
        behaviors: { noSubscriber: NoSubscriberBehavior.Stop, },
    });

    player.on('stateChange', (oldState, newState) => {
        console.log(`[Player] "${oldState.status}" -> "${newState.status}"`);
        if (newState.status == "idle") {
            queue[interaction.member.voice.channel.guild.id].shift();
            play_next_in_queue(interaction, player);
        }
    });
    player.on('error', err => console.log(err));
    connection.subscribe(player);
    play_next_in_queue(interaction, player);
}

function add_to_queue(interaction, url) {
    const guild_id = interaction.member.voice.channel.guild.id;
    if (!queue[guild_id]) queue[guild_id] = new Array();
    queue[guild_id].push(url);
}

function get_queue(interaction) {
    const guild_id = interaction.member.voice.channel.guild.id;
    return queue[guild_id];
}

module.exports = {
    join_voice,
    join_voice_if_required,
    create_player,
    add_to_queue,
    get_queue,
}