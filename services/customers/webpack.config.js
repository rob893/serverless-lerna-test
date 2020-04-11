const path = require("path");
const fs = require("fs");
const nodeExternals = require('webpack-node-externals');
const { NODE_ENV = "production" } = process.env;

const findLinkedModules = (nodeModulesPath) => {
  const modules = [];

  fs.readdirSync(nodeModulesPath).forEach((dirname) => {
    const modulePath = path.resolve(nodeModulesPath, dirname);
    const stat = fs.lstatSync(modulePath);

    if (dirname.startsWith(".")) {
      // not a module or scope, ignore
    } else if (dirname.startsWith("@")) {
      // scoped modules
      modules.push(...findLinkedModules(modulePath));
    } else if (stat.isSymbolicLink()) {
      const realPath = fs.realpathSync(modulePath);
      const realModulePath = path.resolve(realPath, "node_modules");

      modules.push(realModulePath);
    }
  });
  
  return modules;
};

module.exports = {
  entry: "./src/index.ts",
  mode: NODE_ENV,
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: [".ts", ".js"],
    symlinks: false,
    modules: [
      // provide absolute path to the main node_modules,
      // to avoid webpack searching around and getting confused
      // see https://webpack.js.org/configuration/resolve/#resolve-modules
      path.resolve("node_modules"),
      // include linked node_modules as fallback, in case the deps haven't
      // yet propagated to the main node_modules
      ...findLinkedModules(path.resolve("node_modules")),
    ],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ["ts-loader"],
      },
    ],
  },
};
