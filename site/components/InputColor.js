import { useCallback, useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import rgbToHex from "../utils/rgbToHex";
import useClickOutside from "../hooks/useClickOutside";
import useUniqueId from "../hooks/useUniqueId";

export const PopoverPicker = ({ color, onChange }) => {
  const popover = useRef();
  const [isOpen, toggle] = useState(false);
  const close = useCallback(() => toggle(false), []);
  const id = useUniqueId();

  useClickOutside(popover, close);

  return (
    <div className="position-relative">
      <button
        className="usa-button--unstyled border-1px border-black width-4 height-4 text-middle"
        type="button"
        style={{ backgroundColor: color }}
        onClick={() => toggle(true)}
        aria-controls={id}
        aria-expanded={String(isOpen)}
      >
        <span className="usa-sr-only">
          {isOpen ? "Close" : "Open"} color picker
        </span>
      </button>

      {isOpen && (
        <div className="pin-left top-4 z-100" id={id} ref={popover}>
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
};

const InputColor = (props) => {
  const { sassVariableName, tokensManager } = props;
  const { handleChange, setToken, tokens } = tokensManager;

  const colorName = sassVariableName.replace("$theme-color-", "");
  const customValue = tokens ? tokens[sassVariableName] : null;
  const [defaultValue, setDefaultValue] = useState("");
  const defaultColorElement = useRef();
  const id = sassVariableName.replace("$", "");
  const value = customValue || defaultValue;

  const handleColorPickerChange = (color) => {
    setToken(sassVariableName, color);
  };

  /**
   * Set the default value after everything is initialized
   */
  useEffect(() => {
    if (defaultValue) return;

    const element = defaultColorElement.current;
    const computedStyle = getComputedStyle(element);
    const rgb = computedStyle.getPropertyValue("background-color");
    // Browser returns transparent if background-color is empty
    const hex = rgb == "rgba(0, 0, 0, 0)" ? "" : rgbToHex(rgb);

    setDefaultValue(hex);
  }, [defaultColorElement]);

  return (
    <>
      <label
        className="usa-label margin-top-0 margin-bottom-1 font-body-3xs"
        htmlFor={id}
      >
        {colorName}
      </label>
      <div className="display-flex margin-bottom-105">
        <PopoverPicker color={value} onChange={handleColorPickerChange} />
        <div className="flex-fill margin-left-1">
          <input
            className="usa-input width-full font-mono-3xs margin-top-0 height-4"
            onChange={handleChange}
            name={sassVariableName}
            value={value}
            id={id}
          />
          <div ref={defaultColorElement} className={`bg-${colorName}`} />
        </div>
      </div>
    </>
  );
};

export default InputColor;
