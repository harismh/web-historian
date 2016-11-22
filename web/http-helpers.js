var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
};

exports.serveAssets = function(res, asset, callback) {

  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
    
  fs.readFile(archive.paths.siteAssets + asset, function(error, siteData) {
    if (error) {
      fs.readFile(archive.paths.archivedSites + asset, function(error, archiveData) {
        if (error) {
          //either site doesn't exist or bad url
          if (callback) {
            callback(archiveData); // to create website
          } else {
            res.writeHead(404, exports.headers);
            res.end();
          }
        } else {
          //found site in archives
          res.writeHead(200, exports.headers);
          res.end(archiveData.toString());
        }
      });
    } else {
      //found site at siteAssets
      res.writeHead(200, exports.headers);
      res.end(siteData.toString());
    }
  });
};

exports.serveRedirect = function(res, url, code) {
  fs.readFile(archive.paths.archivedSites + url, function(error, data) {
    if (error) {
      throw error;
    } else {
      res.writeHead(code, {Location: archive.paths.archivedSites + url + '.html'});
      res.end(data.toString());
    }
  });
};