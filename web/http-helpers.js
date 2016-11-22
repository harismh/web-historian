var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  
  //console.log('siteAssets ', archive.paths.siteAssets + asset);
  //console.log('archive', archive.paths.archivedSites + asset);
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
            res.writeHead(404, 'error');
            res.end();
          }
        } else {
          //found site in archives
          res.writeHead(200, 'success');
          res.end(archiveData);
        }
      });
    } else {
      //found site at siteAssets
      res.writeHead(200, 'success');
      res.end(siteData);
    }
  });
};

// exports.serveAssets = function(res, asset, callback) {
  
//   console.log('siteAssets ', asset);
//   // Write some code here that helps serve up your static files!
//   // (Static files are things like html (yours or archived from others...),
//   // css, or anything that doesn't change often.)
    
//   fs.readFile(archive.paths.siteAssets + asset, function(error, siteData) {
//     if (error) {
//       res.writeHead(302, 'Go somewhere else');
//       res.end(archive.paths.archivedSites);
//     } else {
//       //found site at siteAssets
//       res.writeHead(200, 'success');
//       res.end(siteData.toString());
//     }
//   });
// };

/*
exports.displayWebsite = function(req , res) {
  fs.readFile(export.path.archivedSites, function(error, data) {
    if (error) {
      throw error;
    } else {
      res.writeHead(200, 'success');
      res.end(data.toString());
    }
  });
}
*/

// As you progress, keep thinking about what helper functions you can put here!
