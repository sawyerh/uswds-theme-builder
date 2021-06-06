import React, { useEffect, useRef, useState } from "react";
import classnames from "classnames";
import dynamic from "next/dynamic";
import { useDebouncedCallback } from "use-debounce";

/**
 * Exclude USWDS scripts from SSR since it breaks otherwise
 */
const ScriptsForUSWDS = dynamic(() => import("../components/ScriptsForUSWDS"), {
  ssr: false,
});

const compileEndpoint = `https://dart-sass-compiler-sx3jbfg55a-uc.a.run.app/compile`;

export default function Preview() {
  const [styles, setStyles] = useState("");
  const [tokensCache, setTokensCache] = useState({});
  const [previewError, setPreviewError] = useState();
  const [isLoading, setIsLoading] = useState();
  const abortControllerRef = useRef();

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
      const response = await fetch(compileEndpoint, {
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

      <div className="padding-05">
        <a className="usa-skipnav" href="#main-content">
          Skip to main content
        </a>

        <div className="usa-overlay"></div>
        <header className="usa-header usa-header--extended">
          <div className="usa-navbar">
            <div className="usa-logo" id="extended-logo">
              <em className="usa-logo__text">
                <a href="/" title="Home" aria-label="Home">
                  Site title
                </a>
              </em>
            </div>
            <button className="usa-menu-btn">Menu</button>
          </div>
          <nav aria-label="Primary navigation" className="usa-nav">
            <div className="usa-nav__inner">
              <button className="usa-nav__close">
                <img src="/img/usa-icons/close.svg" role="img" alt="close" />
              </button>
              <ul className="usa-nav__primary usa-accordion">
                <li className="usa-nav__primary-item">
                  <button
                    className="usa-accordion__button usa-nav__link  usa-current"
                    aria-expanded="false"
                    aria-controls="extended-nav-section-one"
                  >
                    <span>Current section</span>
                  </button>
                  <ul
                    id="extended-nav-section-one"
                    className="usa-nav__submenu"
                  >
                    <li className="usa-nav__submenu-item">
                      <a href="#" className="">
                        {" "}
                        Navigation link
                      </a>
                    </li>
                    <li className="usa-nav__submenu-item">
                      <a href="#" className="">
                        {" "}
                        Navigation link
                      </a>
                    </li>
                    <li className="usa-nav__submenu-item">
                      <a href="#" className="">
                        {" "}
                        Navigation link
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="usa-nav__primary-item">
                  <button
                    className="usa-accordion__button usa-nav__link"
                    aria-expanded="false"
                    aria-controls="extended-nav-section-two"
                  >
                    <span>Section</span>
                  </button>
                  <ul
                    id="extended-nav-section-two"
                    className="usa-nav__submenu"
                  >
                    <li className="usa-nav__submenu-item">
                      <a href="#" className="">
                        {" "}
                        Navigation link
                      </a>
                    </li>
                    <li className="usa-nav__submenu-item">
                      <a href="#" className="">
                        {" "}
                        Navigation link
                      </a>
                    </li>
                    <li className="usa-nav__submenu-item">
                      <a href="#" className="">
                        {" "}
                        Navigation link
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="usa-nav__primary-item">
                  <a className="usa-nav__link" href="#">
                    <span>Simple link</span>
                  </a>
                </li>
              </ul>
              <div className="usa-nav__secondary">
                <ul className="usa-nav__secondary-links">
                  <li className="usa-nav__secondary-item">
                    <a href="">Secondary link</a>
                  </li>
                  <li className="usa-nav__secondary-item">
                    <a href="">Another secondary link</a>
                  </li>
                </ul>
                <form className="usa-search usa-search--small " role="search">
                  <label
                    className="usa-sr-only"
                    htmlFor="extended-search-field-small"
                  >
                    Search small
                  </label>
                  <input
                    className="usa-input"
                    id="extended-search-field-small"
                    type="search"
                    name="search"
                  />
                  <button className="usa-button" type="submit">
                    <span className="usa-sr-only">Search</span>
                  </button>
                </form>
              </div>
            </div>
          </nav>
        </header>

        <main id="main-content">
          <section
            className="usa-hero bg-base-lightest"
            aria-label="Introduction"
          >
            <div className="grid-container">
              <div className="usa-hero__callout">
                <h1 className="usa-hero__heading">
                  <span className="usa-hero__heading--alt">Hero callout:</span>
                  Bring attention to a project priority
                </h1>
                <p>
                  Support the callout with some short explanatory text. You
                  don’t need more than a couple of sentences.
                </p>
                <a className="usa-button" href="#">
                  Call to action
                </a>
              </div>
            </div>
          </section>

          <section className="grid-container usa-section">
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-4">
                <h2 className="font-heading-xl margin-top-0 tablet:margin-bottom-0">
                  A tagline highlights your approach
                </h2>
              </div>
              <div className="tablet:grid-col-8 usa-prose">
                <p>
                  The tagline should inspire confidence and interest, focusing
                  on the value that your overall approach offers to your
                  audience. Use a heading typeface and keep your tagline to just
                  a few words, and don’t confuse or mystify.
                </p>
                <p>
                  Use the right side of the grid to explain the tagline a bit
                  more. What are your goals? How do you do your work? Write in
                  the present tense, and stay brief here. People who are
                  interested can find details on internal pages.
                </p>
              </div>
            </div>
          </section>

          <section className="usa-graphic-list usa-section usa-section--dark">
            <div className="grid-container">
              <div className="usa-graphic-list__row grid-row grid-gap">
                <div className="usa-media-block tablet:grid-col">
                  <img
                    className="usa-media-block__img"
                    src="/img/circle-124.png"
                    alt="Alt text"
                  />
                  <div className="usa-media-block__body">
                    <h2 className="usa-graphic-list__heading">
                      Graphic headings can vary.
                    </h2>
                    <p>
                      Graphic headings can be used a few different ways,
                      depending on what your landing page is for. Highlight your
                      values, specific program areas, or results.
                    </p>
                  </div>
                </div>
                <div className="usa-media-block tablet:grid-col">
                  <img
                    className="usa-media-block__img"
                    src="/img/circle-124.png"
                    alt="Alt text"
                  />
                  <div className="usa-media-block__body">
                    <h2 className="usa-graphic-list__heading">
                      Stick to 6 or fewer words.
                    </h2>
                    <p>
                      Keep body text to about 30 words. They can be shorter, but
                      try to be somewhat balanced across all four. It creates a
                      clean appearance with good spacing.
                    </p>
                  </div>
                </div>
              </div>
              <div className="usa-graphic-list__row grid-row grid-gap">
                <div className="usa-media-block tablet:grid-col">
                  <img
                    className="usa-media-block__img"
                    src="/img/circle-124.png"
                    alt="Alt text"
                  />
                  <div className="usa-media-block__body">
                    <h2 className="usa-graphic-list__heading">
                      Never highlight anything without a goal.
                    </h2>
                    <p>
                      For anything you want to highlight here, understand what
                      your users know now, and what activity or impression you
                      want from them after they see it.
                    </p>
                  </div>
                </div>
                <div className="usa-media-block tablet:grid-col">
                  <img
                    className="usa-media-block__img"
                    src="/img/circle-124.png"
                    alt="Alt text"
                  />
                  <div className="usa-media-block__body">
                    <h2 className="usa-graphic-list__heading">
                      Could also have 2 or 6.
                    </h2>
                    <p>
                      In addition to your goal, find out your users’ goals. What
                      do they want to know or do that supports your mission? Use
                      these headings to show those.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="test-section-id" className="usa-section">
            <div className="grid-container">
              <h2 className="font-heading-xl margin-y-0">Section heading</h2>
              <p className="usa-intro">
                Everything up to this point should help people understand your
                agency or project: who you are, your goal or mission, and how
                you approach it. Use this section to encourage them to act.
                Describe why they should get in touch here, and use an active
                verb on the button below. “Get in touch,” “Learn more,” and so
                on.
              </p>
              <a className="usa-button usa-button--big" href="#;">
                Call to action
              </a>
            </div>
          </section>
        </main>
        <ScriptsForUSWDS />
      </div>
    </>
  );
}
