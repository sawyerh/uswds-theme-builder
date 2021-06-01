const path = require("path");

module.exports = {
  env: {
    API_BASE_URL:
      process.env.NODE_ENV === "production"
        ? "http://localhost/uswds-theme-builder/us-central1/app"
        : "http://localhost:5001/uswds-theme-builder/us-central1/app",
  },
  sassOptions: {
    includePaths: [path.resolve(__dirname, "node_modules/uswds/dist/scss")],
  },
};
