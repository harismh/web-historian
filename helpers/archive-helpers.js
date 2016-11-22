var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'), // /web/public/
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  var list = [];
  fs.readFile(exports.paths.list, function(error, data) {
    if (error) {
      throw error;
    } else {
      list = data.toString().split('\n');
      callback(list);
    }
  });

};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(list) {
    var result = _.contains(list, url);
    callback(result);
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', function(error, data) {
    if (!error) {
      callback();
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(exports.paths.archivedSites, function(error, files) {
    if (error) {
      throw error;
    } else {
      var result = _.contains(files, url);
      callback(result);
    }
  });
  // var directory = path.join(exports.paths.archivedSites, url);
  
  // fs.exists(directory, function(error, success) {
  //   if (success) {
  //     callback (success);
  //   }
  // });
};

exports.downloadUrls = function(array) {
  array.forEach(function(url) {
    if (!!url) {
      console.log('website requested');
      request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url));
    } else {
      return;
    }
  });
};