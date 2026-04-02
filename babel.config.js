const path = require("path");

// babel-preset-expo is nested under expo's own node_modules, not top-level.
// Use require.resolve with an explicit search path so Babel finds it correctly.
const babelPresetExpo = require.resolve("babel-preset-expo", {
  paths: [path.dirname(require.resolve("expo/package.json"))],
});

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [babelPresetExpo, { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
