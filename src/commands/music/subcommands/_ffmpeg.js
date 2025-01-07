const ffmpeg = require('fluent-ffmpeg');

async function webm_to_mp3(source) {
    return new Promise(async (resolve, reject) => {
        let output = source.replace(".webm", ".mp3");
        
        await ffmpeg()
            .input(source)
            .inputFormat('webm')
            .output(output)
            .format('mp3')
            .on('end', function() {
                console.log(`[JAM] Converted: "${source}  ->  ${output}"`);
                return resolve(output);
            })
            .run();
    })

}

module.exports = {
    webm_to_mp3
}