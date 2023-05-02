"use strict";

const fs = require("fs");

module.exports = function (grunt) {
  const config = grunt.config("uglify.all.files");
  grunt.registerTask("remove_map_comment", () => {
    const minLoc = grunt.config.process(Object.keys(config)[0]);

    // Remove the source map comment; it causes way too many problems.
    // The map file is still generated for manual associations
    // https://github.com/jquery/jquery/issues/1707
    const text = fs.readFileSync(minLoc, "utf8").replace(/\/\/# sourceMappingURL=\S+/, "");
    fs.writeFileSync(minLoc, text);
  });
};
