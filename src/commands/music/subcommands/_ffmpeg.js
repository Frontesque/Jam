const ffmpeg = require('fluent-ffmpeg');

async function webm_to_ogg(source) {
    return new Promise(async (resolve, reject) => {
        let output = source.replace(".webm", ".ogg");
        
        await ffmpeg()
            .input(source)
            .inputFormat('webm')
            .output(output)
            .format('ogg')
            .on('end', function() {
                console.log(`[JAM] Converted: "${source}  ->  ${output}"`);
                return resolve(output);
            })
            .run();
    })

}

module.exports = {
    webm_to_ogg
}