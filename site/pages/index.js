import {
  ArticleNyTimes,
  Clipboard,
  Drop,
  FilePlus,
  GithubLogo,
  Sliders,
} from "phosphor-react";
import { useEffect, useRef } from "react";
import ColorTokens from "../components/ColorTokens";
import useTokensManager from "../hooks/useTokensManager";

export default function Home() {
  const previewIframeRef = useRef();
  const tokensManager = useTokensManager();

  /**
   * Send tokens into our Preview iFrame when they change
   */
  useEffect(() => {
    previewIframeRef.current.contentWindow.postMessage(tokensManager.tokens);
  }, [tokensManager.tokens, previewIframeRef]);

  return (
    <>
      <div className="grid-row">
        <section className="grid-col-5 desktop:grid-col-3 bg-black height-viewport overflow-auto">
          <div className="padding-2 border-bottom-1px border-base">
            <button
              type="button"
              className="usa-button--unstyled text-white margin-right-2"
            >
              <span className="display-inline-block text-middle margin-right-05">
                <Sliders size={18} />
              </span>
              Editor
            </button>
            <button
              type="button"
              className="usa-button--unstyled text-white margin-right-2"
            >
              <span className="display-inline-block text-middle margin-right-05">
                <FilePlus size={18} />
              </span>
              Import
            </button>
            <button
              type="button"
              className="usa-button--unstyled text-white margin-right-2"
            >
              <span className="display-inline-block text-middle margin-right-05">
                <Clipboard size={18} />
              </span>
              Export
            </button>
            <a
              href="https://github.com/sawyerh/uswds-theme-builder"
              className="text-white margin-right-2"
              target="_blank"
              rel="noreferrer"
            >
              <span className="display-inline-block text-middle margin-right-05">
                <GithubLogo size={18} />
              </span>
              GitHub
            </a>
          </div>
          <form
            onSubmit={(e) => e.preventDefault}
            className="padding-x-2 padding-y-3"
          >
            <h2 className="text-white font-sans-lg margin-bottom-1 margin-top-0">
              <span className="display-inline-block text-middle margin-right-05 text-mint">
                <Drop size={30} weight="bold" />
              </span>
              Colors
            </h2>
            <a
              className="text-white display-inline-block margin-bottom-2"
              href="https://designsystem.digital.gov/design-tokens/color/theme-tokens/"
              target="_blank"
            >
              Learn about color tokens.
            </a>

            <div className="margin-bottom-4">
              <ColorTokens tokensManager={tokensManager} />
            </div>

            <h2 className="text-white font-sans-lg margin-bottom-1">
              <span className="display-inline-block text-middle margin-right-1 text-gold">
                <ArticleNyTimes size={30} weight="regular" />
              </span>
              Typography
            </h2>
            <a
              className="text-white display-inline-block margin-bottom-2"
              href="https://designsystem.digital.gov/design-tokens/typesetting/overview/"
              target="_blank"
            >
              Learn about typesetting tokens.
            </a>
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
