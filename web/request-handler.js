var path = require('path');
var archive = require('../helpers/archive-helpers');
var helper = require('./http-helpers');
var fs = require('fs');
var url = require('url');
var cron = require('../workers/htmlfetcher.js');

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    var parsed = url.parse(req.url);
    var path = parsed.pathname === '/' ? '/index.html' : parsed.pathname; 
  
    helper.serveAssets(res, path);

  } else if (req.method === 'POST') {
    var string = '';
    req.on('data', function(chunk) {
      string += chunk;
    });

    req.on('end', function() {
      var url = string.slice(4); 

      helper.serveAssets(res, url, function() {
        archive.isUrlInList(url, function(exists) {
          if (exists) {
            archive.isUrlArchived(url, function(found) {
              if (found) {
                helper.serveRedirect(res, '/' + url, 200);
              }
            });
          } else {
            archive.addUrlToList(url, function() {
              res.writeHead(302, {Location: 'loading.html'});
              res.end();
            });
          }
        });
      });
    });
  }
};