// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers.js');

var downloadArchive = function() {
  archive.readListOfUrls(function(list) {
    archive.downloadUrls(list);
  });
};

setInterval(downloadArchive, 1000);