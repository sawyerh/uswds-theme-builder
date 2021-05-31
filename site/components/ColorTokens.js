import Accordion, { AccordionItem } from "./Accordion";
import { useEffect, useRef, useState } from "react";
import rgbToHex from "../utils/rgbToHex";
import tokensData from "../data/tokens.json";
import { set } from "lodash";

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
    if (sassVariableName.startsWith(prefix)) {
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

const InputColor = (props) => {
  const { sassVariableName, tokensManager } = props;
  const { handleChange, tokens } = tokensManager;

  const colorName = sassVariableName.replace("$theme-color-", "");
  const customValue = tokens ? tokens[sassVariableName] : null;
  const [defaultValue, setDefaultValue] = useState("");
  const defaultColorElement = useRef();
  const id = sassVariableName.replace("$", "");
  const value = customValue || defaultValue;

  /**
   * Set the default value after everything is initialized
   */
  useEffect(() => {
    if (defaultValue) return;

    const element = defaultColorElement.current;
    const computedStyle = getComputedStyle(element);
    const rgb = computedStyle.getPropertyValue("background-color");
    const hex = rgbToHex(rgb);

    setDefaultValue(hex);
  }, [defaultColorElement]);

  return (
    <div className="margin-bottom-3">
      <input
        className="margin-right-1"
        type="color"
        onChange={handleChange}
        name={sassVariableName}
        value={value}
        id={id}
      />
      <label className="font-mono-3xs" htmlFor={id}>
        {colorName}
      </label>
      <div className="font-mono-3xs text-base margin-top-05">
        {sassVariableName}: {value}
      </div>
      <div ref={defaultColorElement} className={`bg-${colorName}`} />
    </div>
  );
};

export default ColorTokens;
