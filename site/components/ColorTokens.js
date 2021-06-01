import Accordion, { AccordionItem } from "./Accordion";
import InputColor from "./InputColor";
import tokensData from "../data/tokens.json";

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

const ColorTokens = (props) => {
  return (
    <Accordion>
      {Object.entries(visibleVariablePrefixes).map(
        ([variablePrefix, sassVariables]) => (
          <AccordionItem
            key={variablePrefix}
            heading={variablePrefix.replace("$theme-color-", "")}
          >
            {sassVariables.map((sassVariableName) => (
              <InputColor
                key={sassVariableName}
                sassVariableName={sassVariableName}
                tokensManager={props.tokensManager}
                variablePrefix={variablePrefix}
              />
            ))}
          </AccordionItem>
        )
      )}
    </Accordion>
  );
};

export default ColorTokens;
