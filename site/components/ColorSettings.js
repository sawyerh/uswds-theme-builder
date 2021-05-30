import Accordion, { AccordionItem } from "../components/Accordion";
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

const ColorSettings = (props) => {
  return (
    <>
      <Accordion>
        {Object.entries(colorFamilies).map(([family, variations]) => (
          <AccordionItem heading={family}>
            {variations.map((variation) => (
              <InputColor
                key={`${family}_${variation}`}
                family={family}
                variation={variation}
                onChange={props.onChange}
              />
            ))}
          </AccordionItem>
        ))}
      </Accordion>

      <a
        className="text-white margin-top-2 display-inline-block"
        href="https://designsystem.digital.gov/design-tokens/color/theme-tokens/"
        target="_blank" rel="noreferrer"
      >
        Learn about color tokens.
      </a>
    </>
  );
};

const InputColor = (props) => {
  const { family, variation } = props;
  const colorName = variation ? `${family}-${variation}` : family;
  const settingName = `theme-color-${colorName}`;
  const [value, setValue] = useState("");
  const defaultColorElement = useRef();

  useEffect(() => {
    const element = defaultColorElement.current;

    if (element) {
      const computedStyle = getComputedStyle(element);
      const rgb = computedStyle.getPropertyValue("background-color");
      const hex = rgbToHex(rgb);

      setValue(hex);
    }
  }, [defaultColorElement]);

  const handleChange = (event) => {
    setValue(event.target.value);
    props.onChange(event);
  };

  return (
    <div className="margin-bottom-3">
      <input
        className="margin-right-1"
        type="color"
        onChange={handleChange}
        name={settingName}
        value={value}
        id={settingName}
      />
      <label className="font-mono-3xs" htmlFor={settingName}>
        {colorName}
      </label>
      <div className="font-mono-3xs text-base margin-top-05">{value}</div>
      <div ref={defaultColorElement} className={`bg-${colorName}`} />
    </div>
  );
};

export default ColorSettings;
