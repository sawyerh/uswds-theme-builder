/**
 * @file Parse out the Sass variables directly from the USWDS
 * Scss files. Generates a JSON file, which can be used to identify
 * when USWDS adds/removes/updates a variable. The JSON file is then
 * used as the source of truth for the token editor fields.
 */
const fs = require("fs/promises");
const { parse } = require("postcss-scss");
const path = require("path");
const { set } = require("lodash");

/**
 * @param {string} filename
 * @returns {Promise<Declaration[]>} Sass variables
 */
async function parseVariablesFromFile(filename) {
  return fs
    .readFile(
      path.resolve(
        __dirname,
        `../node_modules/uswds/src/stylesheets/theme/${filename}`
      ),
      { encoding: "utf-8" }
    )
    .then(parse)
    .then(variablesFromScss);
}

/**
 * Pull just Sass variables from a Sass file's AST root
 * @param {Root} scssRoot (https://postcss.org/api/#root)
 * @returns {Declaration} https://postcss.org/api/#declaration
 */
function variablesFromScss(scssRoot) {
  return scssRoot.nodes.filter((n) => n.type === "decl" && n.variable);
}

async function run() {
  const tokens = {};

  function setToken(key, declaration) {
    set(tokens, [key, declaration.prop], declaration.value);
  }

  const colors = await parseVariablesFromFile("_uswds-theme-color.scss");
  colors.forEach((decl) => {
    setToken("colors", decl);
  });

  const components = await parseVariablesFromFile(
    "_uswds-theme-components.scss"
  );
  components.forEach((decl) => {
    setToken("components", decl);
  });

  const typography = await parseVariablesFromFile(
    "_uswds-theme-typography.scss"
  );
  typography.forEach((decl) => {
    setToken("typography", decl);
  });

  await saveTokens(tokens);
}

async function saveTokens(tokens) {
  await fs.writeFile(
    path.resolve(__dirname, "../data/tokens.json"),
    JSON.stringify(tokens, null, 2)
  );
}

run();
