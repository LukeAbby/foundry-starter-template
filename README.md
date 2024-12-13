# Foundry VTT Starter Project

This opinionated starter project comes pre-configured with the following:

- [Vite](https://vite.dev/) for a modern build system with hot reload.
- [Prettier](https://prettier.io/) for formatting.
- [ESLint](https://eslint.org/) for code quality lints.
- [TypeScript](https://www.typescriptlang.org/) for type safety.
- [Foundry VTT Types](https://github.com/League-of-Foundry-Developers/foundry-vtt-types) to provide type definitions for Foundry VTT.

## Getting started

1. Begin by installing Node.
   - It's recommended to install through the Node Version Manager, [`nvm`](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating).
   - Run `nvm install node` to install the newest version. The latest verified version to work is `v22.9.0`, you can install with `nvm install 22.9.0`.
2. Run `corepack enable`. Corepack is the modern solution to installation for package managers. This enables `yarn` as well as `pnpm` etc.
3. Download all dependencies with `yarn install`.
4. In your editor you should make sure you're using Yarn's versions of TypeScript. In VSCode both ESLint and Prettier both automatically recognize the version but you have to select the TypeScript version. You should be automatically prompted to do this when you install but if not, follow these steps to do that:
   1. Open any `.ts` file.
   2. Open the Command Palette, by default Ctrl+Shift+P will open it. Make sure not to delete the `>` character.
   3. Search for "TypeScript Use Workspace Version" in VSCode.
   4. Select "Use the Workspace's Version". If for some weird reason there are multiple, select the entry starting with `.yarn/sdks`.
5. Make sure Foundry is running on `localhost:30000`.  
   If you want to run Foundry somewhere else, set the `FOUNDRY_HOST_NAME` variable and the `FOUNDRY_PORT` variable if needed.  
   Note: This project should automatically handle developers using Windows Subsystem for Linux (WSL) with Foundry running on Windows.
6. Edit the `vite.config.ts` file. Set `packageType` to your package type ("module" or "system") and `packageName` to your package's name. The `packageName` must match the name in your `module.json` file.
7. Go through the steps in [Setting up your package Manifest](#setting-up-your-package-manifest)
8. Start development with `yarn run dev`.
9. Visit `localhost:3001` to see your project during development. You'll get automatic hot reload whenever you save your files.

When you're ready to ship your project, run `yarn run build` to get an optimized build!

## Setting up your package manifest

Foundry requires every [package](https://foundryvtt.com/packages/) to create to create a `system.json`, `module.json`, or `world.json` file called a manifest. Manifests give Foundry critical information about a module like their name and how to execute their code. A `system` is something like Dungeons and Dragons 5e, Pathfinder 2e, or Vampire the Masquerade; all completely different tabletop games. A `module` is something like [Midi QOL](https://foundryvtt.com/packages/midi-qol), [Sequencer](https://foundryvtt.com/packages/sequencer/), or [Token Variant Art](https://foundryvtt.com/packages/token-variants/). Modules can be tied to a particular system or work for all of them and provide various features. Worlds on the other hand are always tied to a system—usually one but occassionally more—and are effectively a collection of preset scenes, actors, items, and so on. What all of these share in common is that they can run code.

Note: Worlds are usually created in the Foundry UI and don't generally include code but if you want to create a world that includes some code, then project can still help you with that too. In that case you should follow the same steps as with modules but with a `world.json` instead. Unfortunately there does not seem to be official documentation on `world.json` files at this time but they generally work similar to `module.json` files.

You must be very careful while creating or editing the package manifest as if you get this part even slightly wrong (e.g. a missed `{` or so on) it is very likely the package will simply not appear in Foundry. Feel free to ask if you are stuck on this part. The [Foundry VTT Discord](https://discord.gg/foundryvtt) and the [League of Extraordinary Foundry Developers (Unofficial)](https://discord.gg/73HTMuK7dT) have people that would be willing to help. Just try to explain your issue as clearly as possible, remember to be patient, and be respectful as everyone there are all volunteering their time to help for free.

### Working on a System

For systems there are a lot of static files, so I would recommend putting them your `system.json` at `static/system.json`. Similarly you should put your lang files in `static/lang`. Here's a `system.json` to get started with that will work with this project:

```json
{
  "id": "my-system",
  "title": "My System",
  "description": "My amazing system.",
  "version": "1.0.0",
  "compatibility": {
    "minimum": "12",
    "verified": "12"
  },
  "authors": [
    {
      "name": "Me"
    }
  ],
  "esmodules": ["index.js"],
  "styles": ["styles.css"],
  "languages": [
    {
      "lang": "en.json",
      "name": "English",
      "path": "lang/en.json"
    }
  ]
}
```

However there's a lot more you can do with a system, you should read up about the system manifest [here](https://foundryvtt.com/article/system-development/#manifest). The rest of the guide there should be helpful too!

Note: [Compendium Packs](https://foundryvtt.com/article/compendium/) enable you ship with a bunch of pre-created actors, items, or so on. To work with them the official [foundryvtt-cli](https://github.com/foundryvtt/foundryvtt-cli) can help!

### Working on a Module

With modules there's generally very few static files so I would recommend putting your `module.json` at the root of the repository, i.e. not inside any folders in this project. If you want to put it somewhere else, for example at `src/module.json` then you should edit the `filesToCopy` array in the `vite.config.ts`. Here's an minimal `module.json` that will work with this project:

```json
{
  "id": "my-module",
  "title": "My Module",
  "description": "My amazing system.",
  "version": "1.0.0",
  "compatibility": {
    "minimum": "12",
    "verified": "12"
  },
  "authors": [
    {
      "name": "Me"
    }
  ],
  "esmodules": ["index.js"],
  "styles": ["styles.css"]
}
```

You can read up about the module manifest [here](https://foundryvtt.com/article/module-development/#manifest). The rest of the guide there should be helpful too!

## License Explanation

Licenses can be confusing, though this one is pretty simple. This explanation isn't legally binding and the subtleties may elude me as I am not a lawyer, just a programmer. This project itself is licensed under the MIT No Attribution License (MIT-0) license, this means:

- You can use this project for any purpose (including commercial purposes).
- You can relicense this project under any license you wish.
- Attribution is not required but appreciated! In this case I'd especially appreciate attribution if you make your own starter project based on this or otherwise redistribute this project without many changes.

The full license text has been copied below for your convenience.

## License

Copyright 2024 LukeAbby

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
