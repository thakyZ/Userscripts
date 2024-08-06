"use strict";

const fs = require("fs");

function release(Release) {
  const { npmTags } = Release;

  function setSrcVersion(filepath) {
    let contents = fs.readFileSync(filepath, "utf8");

    contents = contents.replace(/@VERSION/g, Release.newVersion);
    fs.writeFileSync(filepath, contents, "utf8");
  }

  Release.define({
    npmPublish: true,
    issueTracker: "github",

    /**
     * Set the version in the src folder for distributing ES modules
     * and in the amd folder for AMD.
     */
    _setSrcVersion() {
      setSrcVersion(`${__dirname}/../library/nekogaming.userscript.lib.js`);
    },

    /**
     * Generates any release artifacts that should be included in the release.
     * The callback must be invoked with an array of files that should be
     * committed before creating the tag.
     * @param {Function} callback
     */
    generateArtifacts() {
      Release.exec("npx grunt", "Grunt command failed");
      Release._setSrcVersion();
    },

    /**
     * Acts as insertion point for restoring Release.dir.repo
     * It was changed to reuse npm publish code in jquery-release
     * for publishing the distribution repo instead
     */
    npmTags() {
      // The variable origRepo is not defined if dist was skipped
      Release.dir.repo = Release.dir.origRepo || Release.dir.repo;

      return npmTags();
    },

    /**
     * Publish to distribution repo and npm
     * @param {Function} callback
     */
    dist() {}
  });
}

module.exports = {
  release,
  dependencies: [
    "archiver@5.2.0",
    "shelljs@0.8.4",
    "inquirer@8.0.0"
  ]
};
