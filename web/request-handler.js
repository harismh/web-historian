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
    
    helper.serveAssets(res, path, function() {
      archive.isUrlInList(path, function(result) {
        if (result) {
          res.writeHead(302, 'download page');
          res.end();
        } else {
          res.writeHead(404, 'page not found');
          res.end();
        }
      });
    });
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
                console.log('below redirect');
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

// exports.handleRequest = function (req, res) {
//   if (req.method === 'GET') {
//     if (req.url === '/') {
//       helper.serveAssets(res, req.url + 'index.html');
//     }
//     helper.serveAssets(res, req.url);
//   }
// };