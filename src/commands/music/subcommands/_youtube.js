const YTDlpWrap = require('yt-dlp-wrap').default;
const fs = require("fs");
const utils = require('../../../handlers/utils');
const ffwrap = require("./_ffmpeg");

//---   STATIC VARIABLE   ---//
const CACHE_FOLDER = "cache";
const CACHE_ID_DELIMETER = "_jamcache_"

async function initialize() {
    await YTDlpWrap.downloadFromGithub();
    console.log("[yt-dlp-wrap]", "Latest youtube-dl version downloaded");
    if(!fs.existsSync(CACHE_FOLDER)) fs.mkdirSync(CACHE_FOLDER);
}

function normalize_url(url) {
    return "https://youtube.com/watch?v="+id_from_url(url);
}

async function url_download(url) {
    return new Promise((resolve, reject) => {
        console.log(`[YTDLP] Downloading: "${url}"`);
        const output =
            CACHE_FOLDER
            + "/" 
            + id_from_url(url)
            + CACHE_ID_DELIMETER
            + utils.ran(20)
            + ".webm";
        const ytDlpWrap = new YTDlpWrap('./yt-dlp');
        if (!id_from_url(url)) return reject(new Error(`Invalid YouTube URL: ${url}`));
        let ytdlp_stream = ytDlpWrap.execStream([ normalize_url(url), '-x', '--js-runtimes', 'node', '-f', 'bestaudio' ]);
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
    const webm = await url_download(url);
    if (interaction) interaction.editReply("🔁 Converting...");
    try {
        return await ffwrap.webm_to_ogg(webm);
    } finally {
        fs.rmSync(webm, { force: true });
    }
}

async function download_or_cached(url, interaction) {
    let file;
    const is_file_in_cache = file_in_cache(url);
    if (is_file_in_cache) {
        file = is_file_in_cache;
    } else {
        file = await url_download_ogg(url, interaction);
    }
    return file;
}

function id_from_url(url) {
    let match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}

function file_in_cache(url) {
    const id = id_from_url(url);
    const cache = fs.readdirSync(CACHE_FOLDER);
    for (const i in cache) {
        if (cache[i].split(CACHE_ID_DELIMETER)[0] == id) {
            console.log("[JAM] YouTube ID found in cache:", cache[i]);
            return CACHE_FOLDER + "/" + cache[i];
        }
    }
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

// initialize();
// url_download('https://www.youtube.com/watch?v=DZyYapMZSec');
