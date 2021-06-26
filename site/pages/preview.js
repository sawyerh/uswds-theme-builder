/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useDebouncedCallback } from "use-debounce";

/**
 * Exclude USWDS scripts from SSR since it breaks otherwise
 */
const ScriptsForUSWDS = dynamic(() => import("../components/ScriptsForUSWDS"), {
  ssr: false,
});

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
          <section className="grid-container usa-section bg-accent-cool-lighter">
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

          <section className="grid-container usa-section">
            <h2 className="font-heading-lg">Forms</h2>
            <form className="usa-form usa-form">
              <label className="usa-label" htmlFor="email">
                Email address
              </label>
              <input
                className="usa-input"
                id="email"
                name="email"
                type="email"
                required
              />

              <fieldset className="usa-fieldset usa-form-group">
                <legend className="usa-legend">
                  Select one historical figure
                </legend>
                <div className="usa-radio">
                  <input
                    className="usa-radio__input usa-radio__input--tile"
                    id="historical-truth-2"
                    type="radio"
                    name="historical-figures-2"
                    value="sojourner-truth"
                    defaultChecked
                  />
                  <label
                    className="usa-radio__label"
                    htmlFor="historical-truth-2"
                  >
                    Sojourner Truth
                  </label>
                </div>
                <div className="usa-radio">
                  <input
                    className="usa-radio__input usa-radio__input--tile"
                    id="historical-douglass-2"
                    type="radio"
                    name="historical-figures-2"
                    value="frederick-douglass"
                    defaultChecked={false}
                  />
                  <label
                    className="usa-radio__label"
                    htmlFor="historical-douglass-2"
                  >
                    Frederick Douglass{" "}
                    <span className="usa-checkbox__label-description">
                      This is optional text that can be used to describe the
                      label in more detail.
                    </span>
                  </label>
                </div>
                <div className="usa-radio">
                  <input
                    className="usa-radio__input usa-radio__input--tile"
                    id="historical-washington-2"
                    type="radio"
                    name="historical-figures-2"
                    value="booker-t-washington"
                    defaultChecked={false}
                  />
                  <label
                    className="usa-radio__label"
                    htmlFor="historical-washington-2"
                  >
                    Booker T. Washington
                  </label>
                </div>
                <div className="usa-radio">
                  <input
                    className="usa-radio__input usa-radio__input--tile"
                    id="historical-marshall-2"
                    type="radio"
                    name="historical-figures"
                    value="thurgood-marshall"
                    disabled
                  />
                  <label
                    className="usa-radio__label"
                    htmlFor="historical-marshall-2"
                  >
                    Thurgood Marshall
                  </label>
                </div>
              </fieldset>
              <ul className="usa-button-group">
                <li className="usa-button-group__item">
                  <button className="usa-button usa-button--outline">
                    Back
                  </button>
                </li>
                <li className="usa-button-group__item">
                  <input
                    className="usa-button"
                    type="submit"
                    value="Continue"
                  />
                </li>
              </ul>
            </form>
          </section>

          <section id="test-section-id" className="usa-section">
            <div className="grid-container">
              <article className="usa-prose">
                <h2 id="section-heading-h2">Section heading (h2)</h2>

                <p>
                  These headings introduce, respectively, sections and
                  subsections within your body copy. As you create these
                  headings, follow the same guidelines that you use when writing
                  section headings: Be succinct, descriptive, and precise.
                </p>

                <h3 id="section-heading-h3">Subsection heading (h3)</h3>

                <p>
                  The particulars of your body copy will be determined by the
                  topic of your page. Regardless of topic, it’s a good practice
                  to follow the inverted pyramid structure when writing copy:
                  Begin with the information that’s most important to your users
                  and then present information of less importance.
                </p>

                <p>
                  Keep each section and subsection focused — a good approach is
                  to include one theme (topic) per section.
                </p>

                <h4 id="section-heading-h4">Subsection heading (h4)</h4>

                <p>
                  Use the side navigation menu to help your users quickly skip
                  to different sections of your page. The menu is best suited to
                  displaying a hierarchy with one to three levels and, as we
                  mentioned, to display the sub-navigation of a given page.
                </p>

                <p>
                  Read the full documentation on our side navigation on the
                  component page.
                </p>
                <a className="usa-button usa-button--big" href="#;">
                  Call to action
                </a>
              </article>

              <div className="usa-alert usa-alert--success">
                <div className="usa-alert__body">
                  <h3 className="usa-alert__heading">Success status</h3>
                  <p className="usa-alert__text">
                    Lorem ipsum dolor sit amet,{" "}
                    <a href="#">consectetur adipiscing</a> elit, sed do eiusmod.
                  </p>
                </div>
              </div>

              <div className="usa-alert usa-alert--warning">
                <div className="usa-alert__body">
                  <h3 className="usa-alert__heading">Warning status</h3>
                  <p className="usa-alert__text">
                    Lorem ipsum dolor sit amet,{" "}
                    <a href="#">consectetur adipiscing</a> elit, sed do eiusmod.
                  </p>
                </div>
              </div>

              <div className="usa-alert usa-alert--error" role="alert">
                <div className="usa-alert__body">
                  <h3 className="usa-alert__heading">Error status</h3>
                  <p className="usa-alert__text">
                    Lorem ipsum dolor sit amet,{" "}
                    <a href="#">consectetur adipiscing</a> elit, sed do eiusmod.
                  </p>
                </div>
              </div>

              <div className="usa-alert usa-alert--info">
                <div className="usa-alert__body">
                  <h3 className="usa-alert__heading">Informative status</h3>
                  <p className="usa-alert__text">
                    Lorem ipsum dolor sit amet,{" "}
                    <a href="#">consectetur adipiscing</a> elit, sed do eiusmod.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
        <ScriptsForUSWDS />
      </div>
    </>
  );
}
