const path = require("path");

module.exports = {
  env: {
    API_BASE_URL:
      process.env.NODE_ENV === "production"
        ? "https://us-central1-uswds-theme-builder.cloudfunctions.net/app"
        : "http://localhost:5001/uswds-theme-builder/us-central1/app",
  },
  sassOptions: {
    includePaths: [path.resolve(__dirname, "node_modules/uswds/dist/scss")],
  },
};
