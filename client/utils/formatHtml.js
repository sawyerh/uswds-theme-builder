import htmlParser from "prettier/parser-html";
import prettier from "prettier/standalone";

function formatHtml(html = "") {
  try {
    // TODO: formatWithCursor may be better to use when formatting using CMD+S
    const value = prettier.format(html, {
      parser: "html",
      plugins: [htmlParser],
    });

    return value;
  } catch (error) {
    return html;
  }
}

export default formatHtml;
