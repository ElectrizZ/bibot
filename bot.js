const Discord = require('discord.io');
const logger = require('winston');
const axios = require('axios');

var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {colorize: true});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '*') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            case 'horaires':
				let route_id = args[0]
				let stop_name = args[1].replace('_', '%20')
				let trip_headsign = args[2].replace('_', '%20')
/* 				if (args[3] != null) {
					trip_headsign += '%20' + args[3]
					}
					if (args[4] != null) {
					trip_headsign += '%20' + args[4]
					} */
              const route = `https://applications002.brest-metropole.fr/WIPOD01/Transport/REST/getNextDepartures?format=json&route_id=${route_id}&stop_name=${stop_name}&trip_headsign=${trip_headsign}`
              axios.get(route)
                .then(response => {
                  console.log('Bibus:', route)
                  const d = response.data[0].EstimateTime_arrivalRealized
                  const e = response.data[0].Arrival_time 
                  bot.sendMessage({
                      to: channelID,
                      message: '**Ligne: ' + args[0] + ' Arrêt: ' + args[1] + ' Direction: ' + args[2] + '**\n:clock: Prochain (fiche horaire): ' + '**' + d + '**' + '\n:alarm_clock: Heure réele (localisation): ' + '**' + e + '**'
                  });
                })
                .catch(error => {
                  console.log('GROSSE ERREUR, LEO')
                  console.log(error)
                })
              
            break;
            // Just add any case commands if you want to..
         }
     }
});
