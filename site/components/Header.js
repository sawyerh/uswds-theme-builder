export default function Header() {
  return (
    <>
      <div className="text-white font-body-3xs padding-2 bg-secondary-darker">
        <strong>Work in progress!</strong> A lot of functionality is still
        missing.{" "}
        <a href="https://forms.gle/adA3KkTjxqHcsH5S8" className="text-white">
          Sign up to learn when it&apos;s ready.
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
    </>
  );
}
