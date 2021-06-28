import Accordion, { AccordionItem } from "./Accordion";
import InputColor from "./InputColor";
import tokensData from "../data/tokens.json";
import { useContext } from "react";
import TokensManagerContext from "../context/TokensManagerContext";

/**
 * If a Sass color variable starts with one of these,
 * a control will be rendered for it.
 */
const visibleVariablePrefixes = {
  "$theme-color-base": [],
  "$theme-color-primary": [],
  "$theme-color-secondary": [],
  "$theme-color-accent-cool": [],
  "$theme-color-accent-warm": [],
  "$theme-color-error": [],
  "$theme-color-warning": [],
  "$theme-color-success": [],
  "$theme-color-info": [],
  "$theme-color-emergency": [],
  "$theme-color-disabled": [],
};

Object.keys(tokensData.colors).forEach((sassVariableName) => {
  Object.keys(visibleVariablePrefixes).some((prefix) => {
    if (
      sassVariableName.startsWith(prefix) &&
      !sassVariableName.endsWith("-family")
    ) {
      visibleVariablePrefixes[prefix].push(sassVariableName);
      return true;
    }
  });
});

const ColorTokens = () => {
  return (
    <Accordion>
      {Object.entries(visibleVariablePrefixes).map(
        ([variablePrefix, sassVariables]) => (
          <ColorFamilyTokens
            key={variablePrefix}
            sassVariables={sassVariables}
            variablePrefix={variablePrefix}
          />
        )
      )}
    </Accordion>
  );
};

const ColorFamilyTokens = ({ variablePrefix, sassVariables }) => {
  const { getTokenValue } = useContext(TokensManagerContext);
  const middleColor = getTokenValue(variablePrefix);

  const heading = (
    <>
      {middleColor ? (
        <span
          className="circle-2 display-inline-block margin-right-1 text-middle"
          style={{ backgroundColor: middleColor }}
        >
          {}
        </span>
      ) : null}
      {`${variablePrefix.replace("$theme-color-", "")}`}
    </>
  );

  return (
    <AccordionItem key={variablePrefix} heading={heading}>
      {sassVariables.map((sassVariableName) => (
        <InputColor
          key={sassVariableName}
          sassVariableName={sassVariableName}
          variablePrefix={variablePrefix}
        />
      ))}
    </AccordionItem>
  );
};

export default ColorTokens;
