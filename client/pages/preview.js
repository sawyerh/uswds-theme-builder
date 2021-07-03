/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useDebouncedCallback } from "use-debounce";
import defaultTemplateHtml from "../templates/default.html";

/**
 * Exclude USWDS scripts from SSR since it breaks otherwise
 */
const ScriptsForUSWDS = dynamic(() => import("../components/ScriptsForUSWDS"), {
  ssr: false,
});

export default function Preview(props) {
  const [styles, setStyles] = useState("");
  const [tokensCache, setTokensCache] = useState({});
  const [previewError, setPreviewError] = useState();
  const [isLoading, setIsLoading] = useState();
  const [uswdsKey, setUswdsKey] = useState(1);
  const abortControllerRef = useRef();

  /**
   * Increment a key to force the USWDS script to re-init anytime
   * the DOM re-renders, otherwise things are funky.
   */
  useEffect(() => {
    setUswdsKey((k) => k + 1);
  }, [isLoading]);

  /**
   * Load USWDS styles for the preview
   * @param {object} [tokens] - Sass theme tokens
   */
  const loadStyles = useDebouncedCallback(async () => {
    let body;

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

      body = await response.text();
      response.ok ? setStyles(body) : setPreviewError(body);
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
    abortControllerRef.current = null;
  }, 1000);

  useEffect(() => {
    loadStyles();
  }, [tokensCache]);

  useEffect(() => {
    const handleFrameMessage = (event) => {
      setTokensCache(event.data);
    };

    window.addEventListener("message", handleFrameMessage, false);
    return () => window.removeEventListener("message", handleFrameMessage);
  }, [setStyles]);

  return (
    <>
      {isLoading ? (
        <div className="pin-all position-fixed z-top display-flex flex-column flex-align-center flex-justify-center text-center bg-black opacity-80 text-white">
          <img
            className="display-inline-block margin-bottom-2"
            src="/loader.svg"
            alt="Loading"
            width="36"
          />
          <div>Building theme</div>
        </div>
      ) : null}

      {previewError ? (
        <div className="font-mono-3xs text-white pin-top position-fixed z-top width-full overflow-y-auto maxh-viewport">
          <pre
            className="overflow-x-auto margin-0 padding-105"
            style={{ backgroundColor: "#b50909" }}
          >
            {previewError}
          </pre>
          <div className="bg-base-darkest padding-105">
            <strong>
              Attempted to create theme using the following Sass variables:
            </strong>
            {Object.entries(tokensCache).map(([tokenKey, tokenVar]) => (
              <code className="display-block margin-y-05" key={tokenKey}>
                {tokenKey}: {tokenVar};
              </code>
            ))}
          </div>
        </div>
      ) : null}

      <style>{styles}</style>

      <div
        key="template"
        dangerouslySetInnerHTML={{ __html: defaultTemplateHtml }}
      />
      <ScriptsForUSWDS key={uswdsKey} />
    </>
  );
}
