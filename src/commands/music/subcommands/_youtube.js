const YTDlpWrap = require('yt-dlp-wrap').default;
const fs = require("fs");
const utils = require('../../../handlers/utils');

async function initialize() {
    await YTDlpWrap.downloadFromGithub();
    console.log("[YTDLP]     ", "Latest youtube-dl version downloaded");
    if(!fs.existsSync("cache")) fs.mkdirSync("cache");
}

async function url_download(url) {
    const output = "cache/"+utils.ran(20)+".webm";
    const ytDlpWrap = new YTDlpWrap('./yt-dlp');
    let ytdlp_stream = ytDlpWrap.execStream([ url, '-f', 'bestaudio' ]);
    ytdlp_stream.pipe(fs.createWriteStream(output));
    return output;
}

function url_validate(url) {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}(&.*)?$/;
    return regex.test(url);
}

module.exports = {
    initialize,
    url_download,
    url_validate,
}

// initialize();
// url_download('https://www.youtube.com/watch?v=DZyYapMZSec');