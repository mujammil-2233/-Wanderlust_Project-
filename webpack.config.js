const path = require("path");

module.exports = [
  // Full React App Bundle
  {
    mode: "development",
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "public/js"),
      filename: "app-bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx"],
    },
  },
  // Login Only Bundle
  {
    mode: "development",
    entry: "./src/Login.js",
    output: {
      path: path.resolve(__dirname, "public/js"),
      filename: "login-bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx"],
    },
  },
];
