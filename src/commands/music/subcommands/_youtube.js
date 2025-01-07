const fs = require('fs');
const YTDlpWrap = require('yt-dlp-wrap').default;

async function initialize() {
    await YTDlpWrap.downloadFromGithub();
    console.log("_youtube: Latest youtube-dl version downloaded");
}

async function url_download(url) {
    const ytDlpWrap = new YTDlpWrap('./yt-dlp');
    
ytDlpWrap.exec([ url, '-f', 'best', '-o', 'output.mp4' ])
    .on('progress', progress => {
        if (progress.percent === 100) {
            return;
        }
    })
    .on('ytDlpEvent', (eventType, eventData) => console.log(eventType, eventData) )
    .on('error', (error) => console.error(error))
    .on('close', () => console.log('all done'));

    return;
}

function url_validate(url) {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}(&.*)?$/;
    return regex.test(url);
}

module.exports = {
    url_download,
    url_validate
}

// initialize();
url_download('https://www.youtube.com/watch?v=DZyYapMZSec');