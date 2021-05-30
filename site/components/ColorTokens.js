import Accordion, { AccordionItem } from "./Accordion";
import { useEffect, useRef, useState } from "react";
import rgbToHex from "../utils/rgbToHex";

const colorFamilies = {
  base: ["lightest", "light", "", "dark", "darker", "darkest"],
  primary: ["lighter", "light", "", "dark", "darker"],
  secondary: ["lighter", "light", "", "dark", "darker"],
  "accent-cool": ["lighter", "light", "", "dark", "darker"],
  "accent-warm": ["lighter", "light", "", "dark", "darker"],
  error: ["lighter", "light", "", "dark", "darker"],
  warning: ["lighter", "light", "", "dark", "darker"],
  success: ["lighter", "light", "", "dark", "darker"],
  info: ["lighter", "light", "", "dark", "darker"],
  emergency: ["", "dark"],
  disabled: ["light", "", "dark"],
};

const ColorTokens = (props) => {
  return (
    <Accordion>
      {Object.entries(colorFamilies).map(([family, variations]) => (
        <AccordionItem key={family} heading={family}>
          {variations.map((variation) => (
            <InputColor
              key={`${family}_${variation}`}
              family={family}
              tokensManager={props.tokensManager}
              variation={variation}
            />
          ))}
        </AccordionItem>
      ))}
    </Accordion>
  );
};

const InputColor = (props) => {
  const { family, tokensManager, variation } = props;
  const { handleChange, tokens } = tokensManager;

  const colorName = variation ? `${family}-${variation}` : family;
  const tokenName = `theme-color-${colorName}`;
  const customValue = tokens ? tokens[tokenName] : null;
  const [defaultValue, setDefaultValue] = useState("");
  const defaultColorElement = useRef();
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
        name={tokenName}
        value={value}
        id={tokenName}
      />
      <label className="font-mono-3xs" htmlFor={tokenName}>
        {colorName}
      </label>
      <div className="font-mono-3xs text-base margin-top-05">{value}</div>
      <div ref={defaultColorElement} className={`bg-${colorName}`} />
    </div>
  );
};

export default ColorTokens;
