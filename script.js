#!/usr/bin/env node

import { readdirSync, statSync, readFile, writeFile, existsSync } from "fs";
import { join, extname } from "path";
import { parseFlags, parseExtensions } from "./utils.js";

const args = process.argv.slice(2);
const flags = parseFlags(args);

const allowedExtensions = parseExtensions(args) ?? [".ts", ".js"];

function traverseDirectory(directory) {
  const files = readdirSync(directory);

  files.forEach((file) => {
    const filePath = join(directory, file);
    const fileStat = statSync(filePath);

    if (fileStat.isDirectory()) {
      traverseDirectory(filePath); // Recursively traverse subdirectories
      return;
    }

    const fileExtension = extname(file);

    if (!allowedExtensions.includes(fileExtension.slice(1))) {
      // console.log(`Ignoring file: ${filePath}`);
      return;
    }

    let fileContent = "";
    // Read and process the file
    readFile(filePath, "utf8", (err, data) => {
      fileContent = data;

      if (err) {
        console.error(`Error reading file: ${filePath}`.red);
        return;
      }

      // Regex pattern to match the import statement
      const importPattern = /from ['"].+['"]/gm;

      // import foo from 'bar'
      const oneLineImports = data.match(importPattern) ?? [];

      // import 'some-file';
      const allFileImports = data.match(/import\s* ['"].*['"]/g) ?? [];

      const importMatches = [...oneLineImports, ...allFileImports];

      if (importMatches.length === 0) {
        return;
      }

      importMatches.forEach((importMatch) => {
        if (!importMatch.includes("../") && !importMatch.includes("./")) {
          return;
        }

        const numberOfBackJumps = Array.from(
          importMatch.matchAll(/\.\.\//g)
        ).length;
        const currentFilePathAfterSrcDirectory = filePath
          .substring(filePath.indexOf("\\src") + "\\src".length)
          .replaceAll("\\", "/")
          .replace("/", "");

        // from the path components/general/input.vue => ['components', 'general']
        const directoriesOfPath = getDirectoriesOfPath(
          currentFilePathAfterSrcDirectory
        );

        for (let i = 0; i < numberOfBackJumps; i++) {
          directoriesOfPath.pop();
        }

        let newPath = `${flags.alias ?? "@"}/${directoriesOfPath.join("/")}`;

        if (directoriesOfPath.length > 0) {
          newPath += "/";
        }

        const newImportStatement = importMatch.replace(
          /([\.\/][\.\.\/])+/,
          newPath
        );

        // replace the old path with new one
        fileContent = fileContent.replace(importMatch, newImportStatement);
      });

      writeFile(filePath, fileContent, (err) => {
        if (err) {
          console.error("An error occurred:", err);
          return;
        }
      });
    });
  });
}

const rootDirectory = process.cwd() + "\\src";

const exists = existsSync(rootDirectory);

if (exists) {
  traverseDirectory(rootDirectory);
} else {
  console.log("root dir is not correct");
}

/**
 * @param  {stirng} path
 * @returns {string[]}
 */
function getDirectoriesOfPath(path) {
  return path.split("/").pop();
}
