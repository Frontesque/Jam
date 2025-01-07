const YTDlpWrap = require('yt-dlp-wrap').default;
const fs = require("fs");
const utils = require('../../../handlers/utils');
const ffwrap = require("./_ffmpeg");

async function initialize() {
    await YTDlpWrap.downloadFromGithub();
    console.log("[YTDLP]     ", "Latest youtube-dl version downloaded");
    if(!fs.existsSync("cache")) fs.mkdirSync("cache");
}

async function url_download(url) {
    return new Promise((resolve, reject) => {
        const output = "cache/"+utils.ran(20)+".webm";
        const ytDlpWrap = new YTDlpWrap('./yt-dlp');
        let ytdlp_stream = ytDlpWrap.execStream([ url, '-f', 'bestaudio' ]);
        const write_stream = fs.createWriteStream(output);
        ytdlp_stream.pipe(write_stream);
        write_stream.on('close', _ => {
            console.log(`[JAM] Downloaded: "${url}"  ->  "${output}"`);
            return resolve(output);
        })
    })
}

async function url_download_mp3(url) {
    const webm = await url_download(url);
    const mp3 = await ffwrap.webm_to_mp3(webm);
    fs.unlinkSync(webm);
    return mp3;
}

function url_validate(url) {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}(&.*)?$/;
    return regex.test(url);
}

module.exports = {
    initialize,
    url_download,
    url_download_mp3,
    url_validate,
}

// initialize();
// url_download('https://www.youtube.com/watch?v=DZyYapMZSec');