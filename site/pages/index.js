import { Clipboard, FilePlus, Sliders } from "phosphor-react";
import { useRef, useState } from "react";
import IconButton from "../components/IconButton";
import classnames from "classnames";
import CodeEditor from "../components/CodeEditor";
import Header from "../components/Header";
import Head from "next/head";
import TokensEditor from "../components/TokensEditor";
import TokensManagerContext from "../context/TokensManagerContext";
import useTokensManager from "../hooks/useTokensManager";

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
  const [activeNavButton] = useState(navButtons[0]);
  const tokensManager = useTokensManager();

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
      <TokensManagerContext.Provider value={tokensManager}>
        <div className="grid-row">
          <section className="grid-col-5 desktop:grid-col-3 bg-black height-viewport overflow-auto">
            <Header />

            <nav className="border-bottom-1px border-base padding-left-1 padding-y-1">
              {navButtons.map((navButton) => (
                <IconButton
                  key={navButton.label}
                  aria-current={String(
                    navButton.label === activeNavButton.label
                  )}
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
            <TokensEditor previewIframeRef={previewIframeRef} />
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
      </TokensManagerContext.Provider>
    </>
  );
}
