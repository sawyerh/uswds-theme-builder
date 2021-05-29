import { useEffect, useRef, useState } from "react";

const colors = {
  primary: ["lightest", "light", "", "dark", "darker", "darkest"],
  "accent-cool": ["lightest", "light", "", "dark", "darker", "darkest"],
  base: ["lightest", "light", "", "dark", "darker", "darkest", "ink"],
};

function RGBToHex(rgb) {
  // Choose correct separator
  let sep = rgb.indexOf(",") > -1 ? "," : " ";
  // Turn "rgb(r,g,b)" into [r,g,b]
  rgb = rgb.substr(4).split(")")[0].split(sep);

  let r = (+rgb[0]).toString(16),
    g = (+rgb[1]).toString(16),
    b = (+rgb[2]).toString(16);

  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;

  return "#" + r + g + b;
}

export default function Home() {
  const [settings, setSetting] = useState({});
  const formRef = useRef();

  const handleInputChange = () => {
    const formData = new FormData(formRef.current);

    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
  };

  useEffect(() => {
    console.log("run effect", settings);
  });

  return (
    <div className="padding-2">
      <div className="grid-row grid-gap">
        <div className="grid-col-8">
          <iframe
            className="border-1px height-viewport width-full"
            src="/preview"
            title="Theme preview"
          />
        </div>

        <div className="grid-col-4">
          <form ref={formRef}>
            {Object.keys(colors).map((family) =>
              colors[family].map((variation) => (
                <InputColor
                  key={`${family}_${variation}`}
                  family={family}
                  variation={variation}
                  onChange={handleInputChange}
                />
              ))
            )}
          </form>
        </div>
      </div>
    </div>
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
      const hex = RGBToHex(rgb);

      setValue(hex);
    }
  }, [defaultColorElement]);

  const handleChange = (event) => {
    setValue(event.target.value);
    props.onChange();
  };

  return (
    <>
      <label className="usa-label font-mono-3xs" htmlFor={settingName}>
        {colorName}
      </label>
      <input
        className="margin-top-05"
        type="color"
        onChange={handleChange}
        name={settingName}
        value={value}
        id={settingName}
      />
      <div ref={defaultColorElement} className={`bg-${colorName}`} />
    </>
  );
};
