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
        let ytdlp_stream = ytDlpWrap.execStream([ url, '-f', 'bestaudio' ]);
        const write_stream = fs.createWriteStream(output);
        ytdlp_stream.pipe(write_stream);
        write_stream.on('close', _ => {
            console.log(`[YTDLP] Downloaded: "${url}"  ->  "${output}"`);
            return resolve(output);
        })
    })
}

async function url_download_ogg(url) {
    const webm = await url_download(url);
    const ogg = await ffwrap.webm_to_ogg(webm);
    fs.unlinkSync(webm);
    return ogg;
}

async function download_or_cached(url) {
    let file;
    const is_file_in_cache = file_in_cache(url);
    if (is_file_in_cache) {
        file = is_file_in_cache;
    } else {
        file = await url_download_ogg(url);
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
    url_download,
    url_download_ogg,
    id_from_url,
    file_in_cache,
    download_or_cached,
}

// initialize();
// url_download('https://www.youtube.com/watch?v=DZyYapMZSec');