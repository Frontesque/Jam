const jam = require("./_player");

module.exports = {
    name: "stop",
    execute: async (interaction) => {
        jam.leave(interaction);
        interaction.reply("💨 *poof*")
    }
}