/**
 * Pull just Sass variables from a Sass file's AST root
 * @param {Root} scssRoot (https://postcss.org/api/#root)
 * @returns {Declaration} https://postcss.org/api/#declaration
 */
function variablesFromScss(scssRoot) {
  return scssRoot.nodes.filter((n) => n.type === "decl" && n.variable);
}

module.exports = variablesFromScss;
