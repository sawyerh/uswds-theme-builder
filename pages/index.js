import Accordion, { AccordionItem } from "../components/Accordion";
import { useEffect, useRef, useState } from "react";
import rgbToHex from "../utils/rgbToHex";

const colors = {
  base: ["lightest", "light", "", "dark", "darker", "darkest", "ink"],
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

export default function Home() {
  const [settings, setSetting] = useState();
  const formRef = useRef();
  const previewIframeRef = useRef();

  const handleFieldBlur = (event) => {
    const updatedSettings = Object.assign({}, settings, {
      [event.target.name]: event.target.value,
    });

    setSetting(updatedSettings);
  };

  useEffect(() => {
    if (settings) {
      previewIframeRef.current.contentWindow.postMessage(settings);
    }
  }, [settings, previewIframeRef]);

  return (
    <>
      <div className="grid-row">
        <div className="grid-col-9">
          <iframe
            className="border-1px height-viewport width-full"
            src="/preview"
            title="Theme preview"
            ref={previewIframeRef}
          />
        </div>

        <main className="grid-col-3 bg-primary-darker height-viewport overflow-auto padding-2">
          <form ref={formRef}>
            <Accordion>
              {Object.keys(colors).map((family) => (
                <AccordionItem heading={family}>
                  {colors[family].map((variation) => (
                    <InputColor
                      key={`${family}_${variation}`}
                      family={family}
                      variation={variation}
                      onBlur={handleFieldBlur}
                    />
                  ))}
                </AccordionItem>
              ))}
            </Accordion>
          </form>
        </main>
      </div>
    </>
  );
}

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
  };

  return (
    <div className="margin-bottom-2">
      <input
        className="margin-right-1"
        type="color"
        onChange={handleChange}
        onBlur={props.onBlur}
        name={settingName}
        value={value}
        id={settingName}
      />
      <label className="font-mono-3xs" htmlFor={settingName}>
        {colorName}
      </label>
      <div ref={defaultColorElement} className={`bg-${colorName}`} />
    </div>
  );
};
