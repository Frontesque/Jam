const { spawn } = require('child_process');

async function webm_to_ogg(source) {
    return new Promise(async (resolve, reject) => {
        let output = source.replace(".webm", ".ogg");
        
        console.log(`[FFMPEG] Converting: "${source}  ->  ${output}"`);
        const cmd = spawn('ffmpeg', [
            "-i", source,
            "-f", "opus",
            output
        ]);
        cmd.on('close', (code) => {
            console.log(`[FFMPEG] Converted: "${source}  ->  ${output}"`);
            return resolve(output);
        });


    })
}

module.exports = {
    webm_to_ogg
}