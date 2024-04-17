# Relative-to-Alias Import Converter

A script that automatically converts relative imports to use the `@` alias, which represents the project's source directory.

## Motivation

Dealing with deeply nested directories and relative imports (e.g., ../../../utils/someFile.js) can make code harder to read, maintain, and refactor. The relative-to-alias-import tool solves this problem by allowing you to convert all of these relative imports to use a convenient @ alias, which represents the project's source directory.

This makes your imports more concise and easier to manage, as you no longer have to worry about the exact location of files within your project's directory structure.

## Installation

`npm install -g relative-to-alias-import`

or

`yarn global add relative-to-alias-import`

## Usage

You can use this tool as a one-time command without installing it globally. Simply run:

`npx relative-to-alias-import vue ts js`

the above command will work on vue, ts and js files you can specify what type of files you want

This will scan your codebase, identify all relative imports, and convert them to use the `@` alias. The `@` symbol will point to the project's source directory, making your imports more concise and easier to maintain.

## Features

- Automatically converts relative imports to use the `@` alias
- Adding your allowed extensions (.vue, .ts, .js...)
- Preserves existing imports that already use the `@` alias

## Contributing

If you encounter any issues or have suggestions for new features, please feel free to open an issue.

## License

This project is licensed under the [MIT License](LICENSE).
