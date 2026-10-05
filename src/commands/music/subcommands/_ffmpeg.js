const { spawn } = require('child_process');
const fs = require('fs');

async function webm_to_ogg(source) {
    return new Promise(async (resolve, reject) => {
        let output = source.replace(".webm", ".ogg");
        
        console.log(`[FFMPEG] Converting: "${source}  ->  ${output}"`);
        const cmd = spawn('ffmpeg', [
            "-i", source,
            "-f", "opus",
            output
        ]);
        const fail = err => {
            fs.rmSync(output, { force: true }); // A partial .ogg would be treated as a cache hit
            reject(err);
        };
        cmd.on('error', fail);
        cmd.on('close', (code) => {
            if (code !== 0) return fail(new Error(`ffmpeg exited with code ${code}`));
            console.log(`[FFMPEG] Converted: "${source}  ->  ${output}"`);
            return resolve(output);
        });


    })
}

module.exports = {
    webm_to_ogg
}