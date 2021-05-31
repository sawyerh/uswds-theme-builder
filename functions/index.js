const cors = require("cors")({ origin: true });
const express = require("express");
const functions = require("firebase-functions");
const path = require("path");
const sass = require("sass");

const app = express();

app.use(cors);

app.post("/compile", (request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  const body = request.body ? JSON.parse(request.body) : {};
  const themeSettings = body.settings
    ? Object.entries(body.settings)
        .map(([key, value]) => `${key}: ${value};`)
        .join("")
    : "";

  const sassContent = `
    $theme-show-compile-warnings: false;
    $theme-show-notifications: false;
    $theme-font-path: "/fonts";
    $theme-image-path: "/img";
    ${themeSettings}
    @import "uswds";
`;

  const result = sass.renderSync({
    includePaths: [path.resolve(__dirname, "node_modules/uswds/dist/scss")],
    outputStyle: "compressed",
    data: sassContent,
  });

  response.header("Content-Type", "text/css").send(result.css.toString());
});

exports.app = functions.https.onRequest(app);
