module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "@babel/plugin-transform-runtime",
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@app": "./app",
            "@assets": "./assets",
            "@components": "./components",
            "@constants": "./constants",
            "@hooks": "./hooks",
            "@utils": "./utils",
          },
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      ],
    ],
  };
};
