import {
  ArticleNyTimes,
  Clipboard,
  Drop,
  FilePlus,
  FrameCorners,
  PuzzlePiece,
  Sliders,
} from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import ColorTokens from "../components/ColorTokens";
import IconButton from "../components/IconButton";
import classnames from "classnames";
import useTokensManager from "../hooks/useTokensManager";
import CodeEditor from "../components/CodeEditor";

if (typeof window !== "undefined") {
  require("codemirror/mode/xml/xml");
}

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
          <div className="text-white font-body-3xs padding-2 bg-secondary-darker">
            <strong>Work in progress!</strong> A lot of functionality is still
            missing.{" "}
            <a
              href="https://forms.gle/adA3KkTjxqHcsH5S8"
              className="text-white"
            >
              Sign up to learn when it's ready.
            </a>
          </div>
          <header className="text-white padding-2 border-bottom-1px border-base grid-row">
            <h1 className="grid-col flex-align-self-center font-body-md margin-0">
              USWDS Theme Builder
            </h1>
            <a
              href="https://github.com/sawyerh/uswds-theme-builder"
              className="text-no-underline text-base-lighter hover:text-white"
              target="_blank"
              title="View on GitHub"
              rel="noreferrer"
            >
              <svg
                className="usa-icon usa-icon--size-3"
                aria-hidden="true"
                focusable="false"
                role="img"
              >
                <use xlinkHref="/img/sprite.svg#github"></use>
              </svg>
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
            className="padding-x-2 padding-y-3 usa-form maxw-none"
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

            <h2 className="text-white font-sans-lg margin-bottom-0">
              <span className="display-inline-block text-middle margin-right-1 text-gold">
                <ArticleNyTimes size={30} weight="regular" />
              </span>
              Typography
            </h2>
            {/* <a
              className="text-white display-inline-block margin-bottom-2"
              href="https://designsystem.digital.gov/design-tokens/typesetting/overview/"
              target="_blank"
            >
              Learn about typesetting tokens.
            </a> */}
            <a
              href="https://forms.gle/adA3KkTjxqHcsH5S8"
              className="text-white font-body-3xs"
            >
              Get notified when this functionality is ready.
            </a>

            <h2 className="text-white font-sans-lg  margin-bottom-0">
              <span className="display-inline-block text-middle margin-right-1 text-cyan">
                <FrameCorners size={30} weight="bold" />
              </span>
              Spacing
            </h2>

            <a
              href="https://forms.gle/adA3KkTjxqHcsH5S8"
              className="text-white font-body-3xs"
            >
              Get notified when this functionality is ready.
            </a>

            <h2 className="text-white font-sans-lg  margin-bottom-0">
              <span className="display-inline-block text-middle margin-right-1 text-orange">
                <PuzzlePiece size={30} weight="bold" />
              </span>
              Components
            </h2>

            <a
              href="https://forms.gle/adA3KkTjxqHcsH5S8"
              className="text-white font-body-3xs"
            >
              Get notified when this functionality is ready.
            </a>
          </form>
        </section>
        <div className="grid-col-fill display-flex flex-column">
          <section className="bg-base-lighter flex-fill position-relative">
            <iframe
              className="border-0 pin-all height-full width-full"
              src="/preview"
              title="Theme preview"
              ref={previewIframeRef}
            />
          </section>
          <section className="bg-black width-full">
            <CodeEditor />
          </section>
        </div>
      </div>
    </>
  );
}
