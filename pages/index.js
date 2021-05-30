import { useEffect, useRef, useState, useCallback } from "react";
import ColorSettings from "../components/ColorSettings";
import { debounce } from "lodash";

export default function Home() {
  const [settings, setSetting] = useState();
  const formRef = useRef();
  const previewIframeRef = useRef();

  const updateSettingFromInputEvent = (event) => {
    const updatedSettings = Object.assign({}, settings, {
      [event.target.name]: event.target.value,
    });

    setSetting(updatedSettings);
  };

  const debouncedUpdateSettingFromInputEvent = useCallback(
    debounce((event) => updateSettingFromInputEvent(event), 1000),
    []
  );

  useEffect(() => {
    if (settings) {
      previewIframeRef.current.contentWindow.postMessage(settings);
    }
  }, [settings, previewIframeRef]);

  return (
    <>
      <div className="grid-row">
        <main className="grid-col-3 bg-base-darkest height-viewport overflow-auto padding-2">
          <div className="border-bottom-2px border-white margin-bottom-2 padding-bottom-2">
            <label className="usa-label text-white">Settings</label>
            <select className="usa-select">
              <option>Colors</option>
              <option>Typography</option>
            </select>
          </div>
          <form ref={formRef}>
            <ColorSettings onChange={debouncedUpdateSettingFromInputEvent} />
          </form>
        </main>
        <div className="grid-col-9">
          <iframe
            className="border-1px height-viewport width-full"
            src="/preview"
            title="Theme preview"
            ref={previewIframeRef}
          />
        </div>
      </div>
    </>
  );
}
