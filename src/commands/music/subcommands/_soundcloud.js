const YTDlpWrap = require('yt-dlp-wrap').default;
const fs = require("fs");
const utils = require('../../../handlers/utils');
const ffwrap = require("./_ffmpeg");

//---   STATIC VARIABLE   ---//
const CACHE_FOLDER = "cache/soundcloud";
const CACHE_ID_DELIMETER = "_jamcache_"

function initialize() {
    fs.mkdirSync(CACHE_FOLDER, { recursive: true });
}

// Track ID is "artist__track", derived from the URL path
function id_from_url(url) {
    const match = url.match(/^(?:https?:\/\/)?(?:www\.|m\.)?soundcloud\.com\/([a-zA-Z0-9_-]+)\/(?!sets(?:[/?#]|$))([a-zA-Z0-9_-]+)/);
    return match ? `${match[1]}__${match[2]}`.toLowerCase() : null;
}

function normalize_url(url) {
    const id = id_from_url(url);
    if (!id) return null;
    const [artist, track] = id.split("__");
    return `https://soundcloud.com/${artist}/${track}`;
}

async function url_download(url) {
    return new Promise((resolve, reject) => {
        const id = id_from_url(url);
        if (!id) return reject(new Error(`Invalid SoundCloud URL: ${url}`));
        console.log(`[YTDLP] Downloading: "${url}"`);
        initialize();
        const output = CACHE_FOLDER + "/" + id + CACHE_ID_DELIMETER + utils.ran(20) + ".tmp";
        const ytDlpWrap = new YTDlpWrap('./yt-dlp');
        const ytdlp_stream = ytDlpWrap.execStream([ normalize_url(url), '--no-playlist', '-f', 'bestaudio' ]);
        const write_stream = fs.createWriteStream(output);
        const fail = err => {
            ytdlp_stream.unpipe?.(write_stream);
            write_stream.destroy();
            write_stream.once('close', () => fs.rmSync(output, { force: true }));
            reject(err instanceof Error ? err : new Error(String(err)));
        };
        ytdlp_stream.on('error', fail);
        write_stream.on('error', fail);
        ytdlp_stream.pipe(write_stream);
        write_stream.on('close', _ => {
            if (write_stream.destroyed && !write_stream.writableFinished) return;
            console.log(`[YTDLP] Downloaded: "${url}"  ->  "${output}"`);
            return resolve(output);
        })
    })
}

async function url_download_ogg(url, interaction) {
    if (interaction) interaction.editReply("⬇️ Downloading...");
    const raw = await url_download(url);
    if (interaction) interaction.editReply("🔁 Converting...");
    try {
        return await ffwrap.webm_to_ogg(raw);
    } finally {
        fs.rmSync(raw, { force: true });
    }
}

function file_in_cache(url) {
    const id = id_from_url(url);
    if (!fs.existsSync(CACHE_FOLDER)) return;
    for (const name of fs.readdirSync(CACHE_FOLDER)) {
        if (name.split(CACHE_ID_DELIMETER)[0] == id && name.endsWith(".ogg")) {
            console.log("[JAM] SoundCloud ID found in cache:", name);
            return CACHE_FOLDER + "/" + name;
        }
    }
}

async function download_or_cached(url, interaction) {
    return file_in_cache(url) || await url_download_ogg(url, interaction);
}

module.exports = {
    initialize,
    normalize_url,
    url_download,
    url_download_ogg,
    id_from_url,
    file_in_cache,
    download_or_cached,
}
