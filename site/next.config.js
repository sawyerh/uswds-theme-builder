const path = require("path");

module.exports = {
  sassOptions: {
    includePaths: [path.resolve(__dirname, "node_modules/uswds/dist/scss")],
  },
  trailingSlash: true,
};
