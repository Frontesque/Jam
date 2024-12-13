const { REST, Routes } = require('discord.js');

async function register() {
    const commands = require('../functions/commands').get_base();
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
      console.log('Started refreshing application (/) commands.');
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
      console.log('Successfully reloaded application (/) commands.');

      console.log("Registered Commands:");
      for (const i in commands) console.log(" + ", commands[i].name, " -- ", commands[i].description);
    } catch (error) {
      console.error(error);
    }
}

module.exports = register;