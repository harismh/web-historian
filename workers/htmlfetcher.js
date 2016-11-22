// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers.js');
var CronJob = require('cron').CronJob;

new CronJob('* * * * *', function() {
  console.log('You will see this message every second');
  archive.readListOfUrls(archive.downloadUrls);
}, null, true);

// exports.downloadWebsite = function() {
//   setInterval(function() {
//     archive.readListOfUrls(archive.downloadUrls);
//   }, 5000);
// };


