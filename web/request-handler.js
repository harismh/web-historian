var path = require('path');
var archive = require('../helpers/archive-helpers');
var helper = require('./http-helpers');
var fs = require('fs');
var url = require('url');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    //console.log('url ', req.url === '/');
    if (req.url === '/') {
      //console.log('url ', req.url);
      helper.serveAssets(res, req.url + 'index.html');
    } else {
      helper.serveAssets(res, req.url, function() {
        archive.isUrlInList(req.url, function(result) {
          if (result) {
            res.writeHead(302, 'download page');
            res.end();
          } else {
            res.writeHead(404, 'page not found');
            res.end();
          }
        });
      });
    }
    //console.log('url ', req.url);
  } else if (req.method === 'POST') {
    var string = '';
    req.on('data', function(chunk) {
      string += chunk;
    });

    req.on('end', function() {
      helper.serveAssets(res, string.slice(4), function() {
        archive.isUrlInList(string.slice(4), function(goal) {
          if (goal) {
            console.log('reached true');
            console.log('../../archives/sites/' + string.slice(4));
            res.writeHead(200, {Location: 'http://../../archives/sites/' + string.slice(4)});
            res.end();
          } else {
            console.log('reached false');
            archive.addUrlToList(string.slice(4));
            res.writeHead(302, {Location: './loading.html'});
            res.end();
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