import { useContext, useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import TokensManagerContext from "../context/TokensManagerContext";
import useClickOutside from "../hooks/useClickOutside";
import { useDebounce } from "use-debounce";
import useUniqueId from "../hooks/useUniqueId";

export const PopoverPicker = ({ color, onChange }) => {
  const popover = useRef();
  const [isOpen, toggle] = useState(false);
  const id = useUniqueId();

  useClickOutside(popover, () => toggle(false));

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
  const { sassVariableName } = props;
  const { getTokenValue, setCustomToken } = useContext(TokensManagerContext);
  const [hasChanged, setHasChanged] = useState(false);

  const colorName = sassVariableName.replace("$theme-color-", "");
  const id = colorName;

  /**
   * Cache the field value locally to optimize performance.
   */
  const [value, setValue] = useState(getTokenValue(sassVariableName));
  const [debouncedValue] = useDebounce(value, 500);

  const changeValue = (value) => {
    setValue(value);
    setHasChanged(true);
  };
  const handleChange = (event) => {
    changeValue(event.target.value);
  };

  useEffect(() => {
    if (hasChanged) {
      setCustomToken(sassVariableName, debouncedValue);
    }
  }, [hasChanged, debouncedValue]);

  return (
    <>
      <label
        className="usa-label margin-top-0 margin-bottom-1 font-body-3xs"
        htmlFor={id}
      >
        {colorName}
      </label>
      <div className="display-flex margin-bottom-105">
        <PopoverPicker color={value} onChange={changeValue} />
        <div className="flex-fill margin-left-1">
          <input
            className="usa-input width-full font-mono-3xs margin-top-0 height-4"
            onChange={handleChange}
            name={sassVariableName}
            value={value}
            id={id}
          />
        </div>
      </div>
    </>
  );
};

export default InputColor;
