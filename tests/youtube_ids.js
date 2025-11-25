let urls = [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtu.be/dQw4w9WgXcQ",
    "https://youtu.be/dQw4w9WgXcQ?si=aU1PrVn8rQEtOFK0",
    "https://www.youtube.com/watch?v=dZ1iKGSdeyI&list=PLhdA3Q2I9YLYNS-5GiRUqMOhSplSOiize"
]

const youtube = require("../src/commands/music/subcommands/_youtube");

for (const i in urls) {
    const test = urls[i];
    let test_result = youtube.id_from_url(test);
    console.log(test_result, test);
}