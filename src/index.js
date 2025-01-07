//---   Core Initilization   ---//
require('dotenv').config();
require('./handlers/command_handler');
require('./handlers/command_register');

//---   Extras   ---//
require('./commands/music/subcommands/_youtube').initialize();