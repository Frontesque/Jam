const { Client, Events, GatewayIntentBits } = require('discord.js');

function start() {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.on(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}!`);
  });

  const commands = require('../functions/commands').get();

  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    for (const i in commands) {
      const command = commands[i];
      if (interaction.commandName === command.name) {
        command.execute(interaction);
      }
    }

  });

  client.login(process.env.TOKEN);
}

module.exports = start;