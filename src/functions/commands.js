const fs = require('fs');

function get() {
    const commands = fs.readdirSync('./src/commands/');
    let all_commands = new Array();
    for (const i in commands) {
        const command = require('../commands/'+commands[i]);
        all_commands.push(command);
    }
    return all_commands;
}

function get_base() {
    const commands = get();
    let base = new Array();
    for (const i in commands) {
        base.push({ name: commands[i].name, description: commands[i].description })
    }
    return base;
}

module.exports = {
    get,
    get_base
}