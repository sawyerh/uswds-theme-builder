import {
  ArticleNyTimes,
  Clipboard,
  Drop,
  FilePlus,
  GithubLogo,
  Sliders,
} from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import ColorTokens from "../components/ColorTokens";
import IconButton from "../components/IconButton";
import classnames from "classnames";
import useTokensManager from "../hooks/useTokensManager";

const navButtons = [
  {
    icon: Sliders,
    label: "Editor",
  },
  {
    icon: FilePlus,
    label: "Import",
  },
  {
    icon: Clipboard,
    label: "Export",
  },
];

export default function Home() {
  const previewIframeRef = useRef();
  const tokensManager = useTokensManager();
  const [activeNavButton, setActiveNavButton] = useState(navButtons[0]);

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
          <header className="text-white padding-2 border-bottom-1px border-base grid-row">
            <h1 className="grid-col flex-align-self-center font-body-md margin-0">
              USWDS Theme Builder
            </h1>
            <a
              href="https://github.com/sawyerh/uswds-theme-builder"
              className="border-1px border-base hover:border-white circle-4 display-flex flex-align-center flex-justify-center grid-col-auto text-center text-no-underline text-base-lighter hover:text-white"
              target="_blank"
              title="View on GitHub"
              rel="noreferrer"
            >
              <GithubLogo size={16} weight="bold" />
            </a>
          </header>
          <nav className="border-bottom-1px border-base padding-left-1 padding-y-1">
            {navButtons.map((navButton) => (
              <IconButton
                key={navButton.label}
                aria-current={String(navButton.label === activeNavButton.label)}
                className={classnames(
                  "padding-y-1 padding-x-1 font-body-2xs hover:text-white",
                  {
                    "text-white text-no-underline text-bold":
                      navButton.label === activeNavButton.label,
                    "text-base-lighter":
                      navButton.label !== activeNavButton.label,
                  }
                )}
                icon={navButton.icon}
                iconProps={{
                  weight:
                    navButton.label === activeNavButton.label
                      ? "bold"
                      : "regular",
                }}
              >
                {navButton.label}
              </IconButton>
            ))}
          </nav>
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
          <div className=""></div>
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
