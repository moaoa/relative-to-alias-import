import { readdirSync, statSync, readFile, writeFile } from "fs";
import { join, extname } from "path";

const args = process.argv.slice(2);

const allowedExtensions = args ?? [".ts", ".js"];

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
        console.error(`Error reading file: ${filePath}`);
        return;
      }

      // Regex pattern to match the import statement
      const importPattern = /from ['"].+['"]/gm;

      // import foo from 'bar'
      const oneLineImports = data.match(importPattern) ?? [];

      // import 'some-file';
      const allFileImports = data.match(/import\s* ['"].*['"]/g) ?? [];

      const matches = [...oneLineImports, ...allFileImports];

      if (matches.length === 0) {
        // console.log('no matches for file ', filePath);
        return;
      }

      matches.forEach((match) => {
        if (!match.includes("../")) {
          return;
        }
        const numberOfBackJumps = Array.from(match.matchAll(/\.\.\//g)).length;
        const pathAfterSrcDirectory = filePath
          .substring(filePath.indexOf("\\src") + "\\src".length)
          .replaceAll("\\", "/")
          .replace("/", "");

        // from the path components/general/input.vue => ['components', 'general', 'input.vue']
        const sections = pathAfterSrcDirectory.split("/");

        sections.pop(); // remove the file from the path

        for (let i = 0; i < numberOfBackJumps; i++) {
          sections.pop();
        }

        let newPath = "/@/" + sections.join("/");

        if (sections.length > 0) {
          newPath += "/";
        }

        const newImportStatement = match.replace(/[\.\.\/]+/, newPath);

        // replace the old path with new one
        fileContent = fileContent.replace(match, newImportStatement);
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
traverseDirectory(rootDirectory);
