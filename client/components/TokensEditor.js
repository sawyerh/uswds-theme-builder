import {
  ArticleNyTimes,
  Drop,
  FrameCorners,
  PuzzlePiece,
} from "phosphor-react";
import ColorTokens from "../components/ColorTokens";
import PanelHeading from "../components/PanelHeading";

const TokensEditor = () => {
  return (
    <form onSubmit={(e) => e.preventDefault} className="usa-form maxw-none">
      <PanelHeading>
        <span className="display-inline-block text-middle margin-right-05 text-mint">
          <Drop size={30} />
        </span>
        Colors
      </PanelHeading>
      <a
        className="text-white display-inline-block margin-bottom-2"
        href="https://designsystem.digital.gov/design-tokens/color/theme-tokens/"
        target="_blank"
        rel="noreferrer"
      >
        Learn about color tokens.
      </a>

      <div className="margin-bottom-4">
        <ColorTokens />
      </div>

      <PanelHeading>
        <span className="display-inline-block text-middle margin-right-1 text-gold">
          <ArticleNyTimes size={30} weight="regular" />
        </span>
        Typography
      </PanelHeading>
      {/* <a
    className="text-white display-inline-block margin-bottom-2"
    href="https://designsystem.digital.gov/design-tokens/typesetting/overview/"
    target="_blank"
  >
    Learn about typesetting tokens.
  </a> */}
      <a
        href="https://forms.gle/adA3KkTjxqHcsH5S8"
        className="text-white font-body-3xs margin-bottom-4 display-inline-block"
      >
        Get notified when this functionality is ready.
      </a>

      <PanelHeading>
        <span className="display-inline-block text-middle margin-right-1 text-cyan">
          <FrameCorners size={30} />
        </span>
        Spacing
      </PanelHeading>

      <a
        href="https://forms.gle/adA3KkTjxqHcsH5S8"
        className="text-white font-body-3xs margin-bottom-4 display-inline-block"
      >
        Get notified when this functionality is ready.
      </a>

      <PanelHeading>
        <span className="display-inline-block text-middle margin-right-1 text-orange">
          <PuzzlePiece size={30} />
        </span>
        Components
      </PanelHeading>

      <a
        href="https://forms.gle/adA3KkTjxqHcsH5S8"
        className="text-white font-body-3xs margin-bottom-4 display-inline-block"
      >
        Get notified when this functionality is ready.
      </a>
    </form>
  );
};

export default TokensEditor;
