import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { PreviewFrameMessageEventData } from "../../types/common";

let USWDS;
if (typeof window !== "undefined") {
  import(`uswds/src/js/components`).then((module) => {
    USWDS = module.default;
  });
}

function initUswdsComponents() {
  if (!USWDS) return;

  Object.keys(USWDS).forEach((componentName) => {
    const component = USWDS[componentName];
    if (typeof component.on === "function") {
      try {
        component.on();
      } catch (error) {
        // The Preview HTML might be invalid when the user is typing
        // it in, so this error might then occur
        console.error(error);
      }
    }
  });
}

export default function Preview() {
  const [styles, setStyles] = useState("");
  const [tokensCache, setTokensCache] = useState({});
  const [previewError, setPreviewError] = useState<string>();
  const [previewHtml, setPreviewHtml] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController>();

  /**
   * Load USWDS styles for the preview
   */
  const loadStyles = useDebouncedCallback(async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setPreviewError(null);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_SASS_SERVER, {
        body: JSON.stringify({ ...tokensCache }),
        method: "POST",
        mode: "cors",
        signal: abortControllerRef.current.signal,
      });

      const body = await response.text();
      response.ok ? setStyles(body) : setPreviewError(body);
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
    abortControllerRef.current = null;
  }, 1000);

  /**
   * Re-generate the theme when tokens change
   */
  useEffect(() => { loadStyles() }, [tokensCache]);

  /**
   * Initialize USWDS component JS anytime we render the preview's HTML
   */
  useEffect(initUswdsComponents, [USWDS, previewHtml]);

  /**
   * Receive messages from the parent frame.
   */
  useEffect(() => {
    const handleFrameMessage = (event: MessageEvent) => {
      if (event.origin !== window.origin) return;

      const { name, body }: PreviewFrameMessageEventData = event.data;
      if (name === "update_tokens") {
        setTokensCache(body);
      } else if (name === "update_html") {
        setPreviewHtml(body);
      }
    };

    window.addEventListener("message", handleFrameMessage, false);
    return () => window.removeEventListener("message", handleFrameMessage);
  }, [setStyles]);

  return (
    <>
      {isLoading ? <LoadingScreen /> : null}

      {previewError ? (
        <SassError tokens={tokensCache}>{previewError}</SassError>
      ) : null}

      <style>{styles}</style>

      <section
        className="padding-1"
        style={{
          background:
            "repeating-conic-gradient(#dfe1e2 0% 25%, transparent 0% 50%) 50% / 20px 20px",
        }}
      >
        <div
          className="bg-white"
          key="template"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      </section>
    </>
  );
}

function LoadingScreen() {
  return (
    <div className="pin-all position-fixed z-top display-flex flex-column flex-align-center flex-justify-center text-center bg-black opacity-80 text-white">
      <img
        className="display-inline-block margin-bottom-2"
        src="/loader.svg"
        alt="Loading"
        width="36"
      />
      <div>Building theme</div>
    </div>
  );
}

interface SassErrorProps {
  children: string,
  tokens: Record<string, string>;
}

function SassError({ children, tokens }: SassErrorProps) {
  return (
    <div className="font-mono-3xs text-white pin-top position-fixed z-top width-full overflow-y-auto maxh-viewport">
      <pre
        className="overflow-x-auto margin-0 padding-105"
        style={{ backgroundColor: "#b50909" }}
      >
        {children}
      </pre>
      <div className="bg-base-darkest padding-105">
        <strong>
          Attempted to create theme using the following Sass variables:
        </strong>
        {Object.entries(tokens).map(([tokenKey, tokenVar]) => (
          <code className="display-block margin-y-05" key={tokenKey}>
            {tokenKey}: {tokenVar};
          </code>
        ))}
      </div>
    </div>
  );
}
