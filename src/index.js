//---   Core Initilization   ---//
require('dotenv').config();
require('./handlers/command_handler');
require('./handlers/command_register');

//---   Extras   ---//
const { ready } = require('./handlers/command_handler');
if (!ready) return;
require('./commands/music/subcommands/_youtube').initialize();
require('./commands/music/subcommands/_soundcloud').initialize();