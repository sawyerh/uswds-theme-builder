import {
  ArticleNyTimes,
  Drop,
  FrameCorners,
  PuzzlePiece,
} from "phosphor-react";
import ColorTokens from "../components/ColorTokens";
import { useContext, useEffect } from "react";
import TokensManagerContext from "../context/TokensManagerContext";

const TokensEditor = ({ previewIframeRef }) => {
  const { customTokens } = useContext(TokensManagerContext);

  /**
   * Send tokens into our Preview iFrame when they change
   */
  useEffect(() => {
    previewIframeRef.current.contentWindow.postMessage(customTokens);
  }, [customTokens, previewIframeRef]);

  return (
    <form
      onSubmit={(e) => e.preventDefault}
      className="padding-x-2 padding-y-3 usa-form maxw-none"
    >
      <h2 className="text-white font-sans-lg margin-bottom-1 margin-top-0">
        <span className="display-inline-block text-middle margin-right-05 text-mint">
          <Drop size={30} />
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
        <ColorTokens />
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
          <FrameCorners size={30} />
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
          <PuzzlePiece size={30} />
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
  );
};

export default TokensEditor;
