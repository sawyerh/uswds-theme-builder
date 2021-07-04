import TokensManagerContext from "../context/TokensManagerContext";
import PanelHeading from "../components/PanelHeading";
import { parse } from "postcss-scss";
import { useContext } from "react";
import variablesFromScss from "../utils/variablesFromScss";

const TokensImporter = () => {
  const { setCustomTokens } = useContext(TokensManagerContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = e.target.querySelector("textarea").value;

    try {
      const scss = await parse(value, { syntax: "scss" });
      const declarations = variablesFromScss(scss);

      if (declarations.length > 0) {
        const tokens = {};
        declarations.forEach(({ prop, value }) => {
          tokens[prop] = value;
        });
        setCustomTokens(tokens);
      }
    } catch (error) {
      console.error(error);
      alert(`Error parsing Scss: ${error.message}`);
    }
  };

  return (
    <div className="text-white">
      <PanelHeading>Import</PanelHeading>
      <form onSubmit={handleSubmit} className="usa-form maxw-none">
        <label className="usa-label" htmlFor="importer">
          <strong>USWDS settings variables</strong>
          <span className="usa-hint display-block text-base-light">
            Must follow Scss syntax. All existing values will be replaced with
            the variables you import here. All{" "}
            <a
              className="text-base-light"
              href="https://designsystem.digital.gov/documentation/settings/"
              target="_blank"
            >
              USWDS settings
            </a>{" "}
            are supported.
          </span>
        </label>
        <textarea
          className="usa-textarea font-mono-3xs"
          id="importer"
          name="sass"
          placeholder="$theme-color-primary: #ff0000;"
        />
        <button type="submit" className="usa-button">
          Import &amp; replace custom variables
        </button>
      </form>
    </div>
  );
};

export default TokensImporter;
