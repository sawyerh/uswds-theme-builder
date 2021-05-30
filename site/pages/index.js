import { ArrowSquareOut, GithubLogo, Pencil } from "phosphor-react";
import { useEffect, useRef, useState, useCallback } from "react";
import ColorSettings from "../components/ColorSettings";
import { debounce } from "lodash";
import lzString from "lz-string";
import { useRouter } from "next/router";

export default function Home() {
  const [settings, setSetting] = useState();
  const formRef = useRef();
  const previewIframeRef = useRef();
  const router = useRouter();
  const query = router.query;

  /**
   * Store the changed token setting in the URL query string
   * @param {SyntheticEvent} event
   */
  const updateSettingFromInputEvent = (event) => {
    const updatedSettings = {
      ...settings,
      [event.target.name]: event.target.value,
    };
    const url = new URL(window.location);

    url.searchParams.set(
      "settings",
      lzString.compressToEncodedURIComponent(JSON.stringify(updatedSettings))
    );
    router.push(url.href);
  };

  /**
   * Debounced version of our top-level change handler. Each input
   * has its own change handler that is fired on every change, so we
   * only need a debounced version to store the value in the global state
   */
  const debouncedUpdateSettingFromInputEvent = useCallback(
    debounce((event) => updateSettingFromInputEvent(event), 1000),
    []
  );

  /**
   * Send settings into our Preview iFrame when they change
   */
  useEffect(() => {
    if (settings) {
      previewIframeRef.current.contentWindow.postMessage(settings);
    }
  }, [settings, previewIframeRef]);

  /**
   * Parse and store the token settings from the URL query param
   */
  useEffect(() => {
    if (!query.settings) return;
    const decodedSettingsParam = lzString.decompressFromEncodedURIComponent(
      query.settings
    );
    setSetting(JSON.parse(decodedSettingsParam));
  }, [query.settings]);

  return (
    <>
      <div className="grid-row">
        <section className="grid-col-4 bg-black height-viewport overflow-auto">
          <div className="bg-base-darker padding-2">
            <div className="margin-bottom-2 padding-bottom-2 border-bottom-1px border-base-light">
              <button
                type="button"
                className="usa-button--unstyled text-white margin-right-2 padding-y-1"
              >
                <span className="display-inline-block text-middle margin-right-05">
                  <Pencil size={18} />
                </span>
                Editor
              </button>
              <button
                type="button"
                className="usa-button--unstyled text-white margin-right-2 padding-y-1"
              >
                <span className="display-inline-block text-middle margin-right-05">
                  <ArrowSquareOut size={18} />
                </span>
                Export
              </button>
              <a
                href="https://github.com/sawyerh/uswds-theme-builder"
                className="usa-button--unstyled text-white margin-right-2 padding-y-1"
                target="_blank" rel="noreferrer"
              >
                <span className="display-inline-block text-middle margin-right-05">
                  <GithubLogo size={18} />
                </span>
                GitHub
              </a>
            </div>

            <label
              htmlFor="tokens-menu"
              className="usa-label text-white margin-top-0"
            >
              Tokens
            </label>
            <select id="tokens-menu" name="tokens-menu" className="usa-select">
              <option>Colors</option>
              <option>Spacing</option>
              <option>Typography</option>
            </select>
          </div>
          <form ref={formRef} className="padding-2">
            <ColorSettings onChange={debouncedUpdateSettingFromInputEvent} />
          </form>
        </section>
        <div className="grid-col-fill">
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
