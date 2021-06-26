export default function Header() {
  return (
    <>
      <header className="text-white padding-2 border-bottom-1px border-base grid-row">
        <div className="grid-col flex-align-self-center">
          <h1 className="font-body-2xs margin-top-0 margin-bottom-05">
            USWDS Theme Builder
          </h1>
          <span className="usa-tag bg-secondary-dark">Beta</span>
        </div>
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
    </>
  );
}
