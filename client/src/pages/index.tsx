import { Clipboard, FilePlus, Sliders } from "phosphor-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import IconButton from "../components/IconButton";
import Header from "../components/Header";
import Head from "next/head";
import TokensEditor from "../components/TokensEditor";
import TokensManagerContext from "../context/TokensManagerContext";
import classnames from "classnames";
import defaultTemplateHtml from "../../templates/default.html";
import dynamic from "next/dynamic";
import formatHtml from "../utils/formatHtml";
import useTokensManager from "../hooks/useTokensManager";
import { PreviewFrameMessageEventData } from "../../types/common";

const CodeEditor = dynamic(() => import("../components/CodeEditor"));
const TokensExporter = dynamic(() => import("../components/TokensExporter"));
const TokensImporter = dynamic(() => import("../components/TokensImporter"));

const initialPreviewFrameHtml = formatHtml(defaultTemplateHtml);

type PanelName = "Editor" | "Export" | "Import";

export default function Home() {
  const [activePanel, setActivePanel] = useState<PanelName>(panelNavButtons[0].panel);
  // Frame can't accept messages until it's loaded and its listener is established.
  const [previewFrameLoaded, setPreviewFrameLoaded] = useState(false);
  const [previewFrameHtml, setPreviewFrameHtml] = useState(
    formatHtml(defaultTemplateHtml)
  );
  const previewFrameRef = useRef<HTMLIFrameElement>();
  const tokensManager = useTokensManager();

  /**
   * Send data into the preview iframe.
   */
  const postMessageToPreviewIframe = (data: PreviewFrameMessageEventData) => {
    previewFrameRef.current.contentWindow.postMessage(data, window.origin);
  };

  /**
   * Redirect requests to the default Firebase domain.
   */
  useEffect(() => {
    if (
      process.env.NODE_ENV === "production" &&
      window.origin.match(/uswds-theme.dev/) === null
    ) {
      window.location.assign("https://uswds-theme.dev");
    }
  }, []);

  /**
   * Sync the tokens used in the preview frame's theme
   */
  useEffect(() => {
    postMessageToPreviewIframe(
      { name: "update_tokens", body: tokensManager.customTokens });
  }, [tokensManager.customTokens, previewFrameRef, previewFrameLoaded]);

  /**
   * Sync the HTML used in the preview frame
   */
  useEffect(() => {
    postMessageToPreviewIframe({ name: "update_html", body: previewFrameHtml });
  }, [previewFrameHtml, previewFrameRef, previewFrameLoaded]);

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
        <meta
          name="description"
          content="Create a custom U.S. Web Design System theme using your project's colors, typography, and spacing."
        />
        <link rel="canonical" href="https://uswds-theme.dev" />
      </Head>
      <div className="grid-row">
        <section className="grid-col-5 desktop:grid-col-3 bg-black height-viewport overflow-auto">
          <Header />
          <PanelNav activePanel={activePanel} onPanelChange={setActivePanel} />

          <div className="padding-x-2 padding-y-3">
            <TokensManagerContext.Provider value={tokensManager}>
              {activePanel === "Editor" && <TokensEditor />}
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
              ref={previewFrameRef}
              onLoad={() => setPreviewFrameLoaded(true)}
            />
          </section>
          <section className="bg-black width-full">
            <CodeEditor
              initialValue={initialPreviewFrameHtml}
              onChange={setPreviewFrameHtml}
            />
          </section>
        </div>
      </div>
    </>
  );
}

const panelNavButtons: { icon: ReactNode, panel: PanelName }[] = [
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

interface PanelNavProps {
  activePanel: PanelName;
  onPanelChange: (panel: PanelName) => void;
}
function PanelNav({ activePanel, onPanelChange }: PanelNavProps) {
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
