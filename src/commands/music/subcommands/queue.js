const jam = require("./_player");

module.exports = {
    name: "queue",
    execute: async (interaction) => {
        const queue = jam.get_queue(interaction);
        interaction.reply(`Now Playing: ${queue.join("\n")}`);
    }
}