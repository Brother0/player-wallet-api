/* eslint-disable */
const fs = require("fs");
const { compileFromFile } = require("json-schema-to-typescript");

async function generate() {
  fs.readdir("src/schemas", function (err, filenames) {
    if (err) {
      return;
    }
    filenames.forEach(async function (filename) {
      if(filename.split(".")[1] === "json") {
        fs.writeFileSync(
          `src/models/${filename.split(".")[0]}.d.ts`,
          await compileFromFile(`src/schemas/${filename}`)
        );
      }
    });
  });
}

generate();
