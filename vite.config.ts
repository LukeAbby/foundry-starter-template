import * as fs from "fs/promises";
import * as Vite from "vite";
import { checker } from "vite-plugin-checker";
import { viteStaticCopy } from "vite-plugin-static-copy";
import tsconfigPaths from "vite-tsconfig-paths";
import esbuild from "esbuild";
import * as path from "path";
import { findFoundryHost, findManifestJSON } from "./utils.ts";

export type PackageType = "module" | "system" | "world";

const packageType: PackageType = "REPLACE ME";

// The package name should be the same as the name in the `module.json`/`system.json` file.
const packageID: string = "REPLACE ME";

const manifestJSONPath = await findManifestJSON(packageType);

const filesToCopy = [
  manifestJSONPath,
  "CHANGELOG.md",
  "README.md",
  "CONTRIBUTING.md",
]; // Feel free to change me.

const devServerPort = 3001;

// @ts-expect-error the types are set to invalid values to ensure the user sets them.
if (packageType == "REPLACE ME" || packageID == "REPLACE ME") {
  throw new Error(
    `Must set the "packageType" and the "packageID" variables in vite.config.ts`,
  );
}

const foundryHostData = await findFoundryHost();
const foundryHost = foundryHostData.host;

const foundryPackagePath = getFoundryPackagePath(packageType, packageID);

// await symlinkFoundryPackage(packageType, packageID, foundryHostData);

const config = Vite.defineConfig(({ command, mode }): Vite.UserConfig => {
  const buildMode = mode === "production" ? "production" : "development";
  const outDir = "dist";

  const plugins: Vite.Plugin[] = [
    checker({ typescript: { buildMode: true } }),
    tsconfigPaths(),
  ];

  // Handle minification after build to allow for tree-shaking and whitespace minification
  // "Note the build.minify option does not minify whitespaces when using the 'es' format in lib mode, as it removes
  // pure annotations and breaks tree-shaking."
  if (buildMode === "production") {
    plugins.push(
      minifyPlugin(),
      ...viteStaticCopy({
        targets: filesToCopy.map((file) => ({ src: file, dest: path.dirname(file) })),
      }),
    );
  } else {
    plugins.push(foundryHMRPlugin());
  }

  return {
    base: command === "build" ? "/" : `/${foundryPackagePath}`,
    publicDir: "static",
    build: {
      outDir,
      minify: true,
      sourcemap: buildMode === "development",
      lib: {
        name: packageID,
        entry: "src/index.ts",
        formats: ["es"],
        fileName: "index",
      },
      target: "es2023",
    },
    optimizeDeps: {
      entries: [],
    },
    server: {
      port: devServerPort,
      open: "/game",
      proxy: {
        [`^(?!${escapeRegExp(foundryPackagePath)})`]: `http://${foundryHost}`,
        "/socket.io": {
          target: `ws://${foundryHost}`,
          ws: true,
        },
      },
    },
    plugins,
  };
});

// Credit to PF2e's vite.config.ts for this https://github.com/foundryvtt/pf2e/blob/master/vite.config.ts
function minifyPlugin(): Vite.Plugin {
  return {
    name: "minify",
    config() {
      return { build: { minify: false } };
    },
    renderChunk: {
      order: "post",
      async handler(code, chunk) {
        return chunk.fileName.endsWith(".mjs")
          ? esbuild.transform(code, {
              keepNames: true,
              minifyIdentifiers: false,
              minifySyntax: true,
              minifyWhitespace: true,
            })
          : code;
      },
    },
  };
}

function getFoundryPackagePath(packageType: PackageType, packageID: string) {
  // Foundry puts a package at the path `/modules/module-name`, `/systems/system-name`, or `/worlds/world-name`.
  return `${packageType}s/${packageID}/`;
}

// Escapes all RegExp meta-characters like .
function escapeRegExp(unescaped: string): string {
  return unescaped.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function foundryHMRPlugin(): Vite.Plugin {
  // Vite HMR is only preconfigured for css files: add handler for HBS and lang files
  return {
    name: "hmr-handler",
    apply: "serve",
    async handleHotUpdate(context) {
      const { outDir } = context.server.config.build;

      if (context.file.startsWith(outDir)) return;

      const baseName = path.basename(context.file);
      const extension = path.extname(context.file);

      if (baseName === "en.json") {
        const basePath = context.file.slice(context.file.indexOf("lang/"));

        console.log(`Updating lang file at ${basePath}`);

        await fs.copyFile(context.file, `${outDir}/${basePath}`);

        context.server.ws.send({
          type: "custom",
          event: "lang-update",
          data: { path: `${foundryPackagePath}/${basePath}` },
        });

        return;
      }

      if (extension === ".hbs") {
        const basePath = context.file.slice(context.file.indexOf("templates/"));
        console.log(`Updating template file at ${basePath}`);

        await fs.copyFile(context.file, `${outDir}/${basePath}`);

        context.server.ws.send({
          type: "custom",
          event: "template-update",
          data: { path: `${foundryPackagePath}/${basePath}` },
        });

        return;
      }
    },
  };
}

export default config;
