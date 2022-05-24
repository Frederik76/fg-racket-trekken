const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { createCompatibilityConfig } = require('@open-wc/building-webpack');

// Supports IE11
module.exports = createCompatibilityConfig({
  input: path.resolve(__dirname, './index.html'),
  plugins: [
    new CopyWebpackPlugin([path.resolve(__dirname, './node_modules/ing-*/**/assets/**/*')]),
  ],
});
