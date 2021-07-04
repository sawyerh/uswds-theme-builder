import TokensManagerContext from "../context/TokensManagerContext";
import PanelHeading from "../components/PanelHeading";
import { useContext } from "react";

const TokensExporter = () => {
  const { customTokens } = useContext(TokensManagerContext);
  const sass = Object.entries(customTokens)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, value]) => `${name}: ${value};`)
    .join("\n");

  return (
    <div className="text-white">
      <PanelHeading>Sass variables</PanelHeading>
      <pre className="bg-base-darker padding-2 overflow-x-auto font-mono-2xs line-height-mono-4">
        {sass}
      </pre>
    </div>
  );
};

export default TokensExporter;
