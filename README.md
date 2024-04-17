# Relative-to-Alias Import Converter

A script that automatically converts relative imports to use the `@` alias, which represents the project's source directory.

## Motivation

Managing a large codebase with deeply nested directories can be a hassle, as it often leads to a proliferation of relative imports (e.g., `../../../utils/someFile.js`). This can make the code harder to read, maintain, and refactor. The `relative-to-alias-import` tool aims to simplify this problem by allowing you to convert all of these relative imports to use a convenient `@` alias, which represents the project's source directory.

## Installation

You can use this tool as a one-time command without installing it globally. Simply run:

npx relative-to-alias-import

Copy

If you'd like to install it globally, you can do so using npm or yarn:

npm install -g relative-to-alias-import

or

yarn global add relative-to-alias-import

## Usage

To use the tool, simply run the following command in your project's root directory:

relative-to-alias-import

This will scan your codebase, identify all relative imports, and convert them to use the `@` alias. The `@` symbol will point to the project's source directory, making your imports more concise and easier to maintain.

## Features

- Automatically converts relative imports to use the `@` alias
- Supports TypeScript, and Vue files
- Preserves existing imports that already use the `@` alias

## Contributing

If you encounter any issues or have suggestions for new features, please feel free to open an issue.

## License

This project is licensed under the [MIT License](LICENSE).
