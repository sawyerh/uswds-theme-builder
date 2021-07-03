const path = require("path");

module.exports = {
  sassOptions: {
    includePaths: [path.resolve(__dirname, "node_modules/uswds/dist/scss")],
  },
  trailingSlash: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.html$/i,
      loader: "html-loader",
      options: {
        // Don't attempt to import img files
        sources: false,
      },
    });

    return config;
  },
};
