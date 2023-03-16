const fs = require("fs");
const path = require("path");

const ignoredDirectories = [ ".git", "node_modules" ];

function checkDirectoryPath(directory) {
  const directorySplit = directory.split(path.sep);
  for (const value of ignoredDirectories) {
    return directorySplit.includes(value);
  }
  return false;
}

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (err) done(err);
        if (stat && stat.isDirectory()) {
          if (!checkDirectoryPath(file)) {
            walk(file, function(err, res) {
              if (err) done(err);
              results = results.concat(res);
              if (!--pending) done(null, results);
            });
          }
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

function parseFiles(files) {
  for (const [, file] of Object.entries(files)) {
    const fileStat = fs.statSync(file);
    if (fileStat.isFile() && !fileStat.isDirectory()) {
      const extension = path.extname(file);
      const fileData = fs.readFileSync(file, { encoding: "utf-8", flag: "r+" });
      if (extension === ".js") {
        const userScriptDetect = /\/\/ ==UserScript==\n(?:\/\/ @\w+ +?.+\n)+\/\/ ==\/UserScript==\n\/\* global .+ \*\/\nthis\.\$ = this\.jQuery = jQuery\.noConflict\(true\);/;
        if (userScriptDetect.test(fileData)) {
          const matched = fileData.match(userScriptDetect);
          const count1 = matched[0].split(/\r?\n/);
        }
      } else if (extension === ".css") {
        const userStyleDetect = /\/\* ==UserStyle==\n(?:@\w+ +?.+\n)+==\/UserStyle== \*\//;
        if (userStyleDetect.test(fileData)) {
          const matched = fileData.match(userStyleDetect);
          console.log(matched[0]);
          const count2 = matched[0].split(/\r?\n/);
        }
      }
    }
  }
};

function getFiles() {
  walk(__dirname, function(error, results) {
    if (error !== null) throw new Error(`Failed to walk directory ${__dirname}.`);
    parseFiles(results);
  });
};

getFiles();