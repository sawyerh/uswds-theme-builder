import { Clipboard, FilePlus, Sliders } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import IconButton from "../components/IconButton";
import classnames from "classnames";
import Header from "../components/Header";
import Head from "next/head";
import TokensManagerContext from "../context/TokensManagerContext";
import defaultTemplateHtml from "../templates/default.html";
import dynamic from "next/dynamic";
import formatHtml from "../utils/formatHtml";
import useTokensManager from "../hooks/useTokensManager";

const CodeEditor = dynamic(() => import("../components/CodeEditor"));
const TokensEditor = dynamic(() => import("../components/TokensEditor"));
const TokensExporter = dynamic(() => import("../components/TokensExporter"));
const TokensImporter = dynamic(() => import("../components/TokensImporter"));

const initialPreviewHtml = formatHtml(defaultTemplateHtml);

export default function Home() {
  const previewIframeRef = useRef();
  const [activePanel, setActivePanel] = useState(panelNavButtons[0].panel);
  const tokensManager = useTokensManager();

  const [previewHtml, setPreviewHtml] = useState(
    formatHtml(defaultTemplateHtml)
  );

  /**
   * Send data into the preview iframe.
   * @param {string} name - Message name.
   * @param {any} body - Data to send.
   */
  const postMessageToPreviewIframe = (name, body) => {
    previewIframeRef.current.contentWindow.postMessage({
      name,
      body,
    });
  };

  /**
   * Sync the tokens used in the preview frame's theme
   */
  useEffect(() => {
    postMessageToPreviewIframe("update_tokens", tokensManager.customTokens);
  }, [tokensManager.customTokens, previewIframeRef]);

  /**
   * Sync the HTML used in the preview frame
   */
  useEffect(() => {
    postMessageToPreviewIframe("update_html", previewHtml);
  }, [previewHtml, previewIframeRef]);

  return (
    <>
      <Head>
        {process.env.NODE_ENV !== "development" ? (
          <script
            src="https://cdn.usefathom.com/script.js"
            data-site="VSKIJXFW"
            defer
          ></script>
        ) : null}
      </Head>
      <div className="grid-row">
        <section className="grid-col-5 desktop:grid-col-3 bg-black height-viewport overflow-auto">
          <Header />
          <PanelNav activePanel={activePanel} onPanelChange={setActivePanel} />

          <div className="padding-x-2 padding-y-3">
            <TokensManagerContext.Provider value={tokensManager}>
              {activePanel === "Editor" && (
                <TokensEditor previewIframeRef={previewIframeRef} />
              )}
              {activePanel === "Import" && <TokensImporter />}
              {activePanel === "Export" && <TokensExporter />}
            </TokensManagerContext.Provider>
          </div>
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
            <CodeEditor
              initialValue={initialPreviewHtml}
              onChange={setPreviewHtml}
            />
          </section>
        </div>
      </div>
    </>
  );
}

const panelNavButtons = [
  {
    icon: Sliders,
    panel: "Editor",
  },
  {
    icon: FilePlus,
    panel: "Import",
  },
  {
    icon: Clipboard,
    panel: "Export",
  },
];

function PanelNav({ activePanel, onPanelChange }) {
  return (
    <nav className="border-bottom-1px border-base padding-left-1 padding-y-1">
      {panelNavButtons.map((navButton) => (
        <IconButton
          key={navButton.panel}
          aria-current={String(navButton.panel === activePanel)}
          className={classnames(
            "padding-y-1 padding-x-1 font-body-2xs hover:text-white",
            {
              "text-white text-no-underline text-bold":
                navButton.panel === activePanel,
              "text-base-lighter": navButton.panel !== activePanel,
            }
          )}
          icon={navButton.icon}
          iconProps={{
            weight: navButton.panel === activePanel ? "bold" : "regular",
          }}
          onClick={() => onPanelChange(navButton.panel)}
        >
          {navButton.panel}
        </IconButton>
      ))}
    </nav>
  );
}
