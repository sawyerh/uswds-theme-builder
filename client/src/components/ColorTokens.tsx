import Accordion, { AccordionItem } from "./Accordion";
import { useContext, useEffect, useRef, useState } from "react";
import InputColor from "./InputColor";
import TokensManagerContext from "../context/TokensManagerContext";
import tokensData from "../../data/tokens.json";
import { flattenDeep } from "lodash";
import rgbToHex from "../utils/rgbToHex";

/**
 * If a Sass color variable starts with one of these,
 * a control will be rendered for it.
 */
type SassColorVariables = Array<string>;

const visibleVariablePrefixes: Record<string, SassColorVariables> = {
  "$theme-color-base": [],
  "$theme-color-primary": [],
  "$theme-color-secondary": [],
  "$theme-color-accent-cool": [],
  "$theme-color-accent-warm": [],
  "$theme-color-error": [],
  "$theme-color-warning": [],
  "$theme-color-success": [],
  "$theme-color-info": [],
  "$theme-color-emergency": [],
  "$theme-color-disabled": [],
};

Object.keys(tokensData.colors).forEach((sassVariableName) => {
  Object.keys(visibleVariablePrefixes).some((prefix) => {
    if (
      sassVariableName.startsWith(prefix) &&
      !sassVariableName.endsWith("-family")
    ) {
      visibleVariablePrefixes[prefix].push(sassVariableName);
      return true;
    }
  });
});

const ColorTokens = () => {
  const [hasComputedColorTokens, setHasComputedColorTokens] = useState(false);

  /**
   * Make sure we've computed the default hex values for the tokens before
   * rendering the token editor.
   */
  if (!hasComputedColorTokens) {
    return (
      <ComputedDefaultTokensSetter
        onComplete={() => setHasComputedColorTokens(true)}
        sassVariables={flattenDeep(Object.values(visibleVariablePrefixes))}
      />
    );
  }

  return (
    <Accordion>
      {Object.entries(visibleVariablePrefixes).map(
        ([variablePrefix, sassVariables]) => (
          <ColorFamilyTokens
            key={variablePrefix}
            sassVariables={sassVariables}
            variablePrefix={variablePrefix}
          />
        )
      )}
    </Accordion>
  );
};

interface ColorFamilyTokensProps {
  sassVariables: SassColorVariables;
  variablePrefix: string;
}

const ColorFamilyTokens = ({ variablePrefix, sassVariables }: ColorFamilyTokensProps) => {
  const { getTokenValue } = useContext(TokensManagerContext);
  const middleColor = getTokenValue(variablePrefix);

  const heading = (
    <>
      {middleColor ? (
        <span
          className="circle-2 display-inline-block margin-right-1 text-middle"
          style={{ backgroundColor: middleColor }}
        >
          { }
        </span>
      ) : null}
      {`${variablePrefix.replace("$theme-color-", "")}`}
    </>
  );

  return (
    <AccordionItem key={variablePrefix} heading={heading}>
      {sassVariables.map((sassVariableName) => (
        <InputColor
          key={sassVariableName}
          sassVariableName={sassVariableName}
        />
      ))}
    </AccordionItem>
  );
};

interface ComputedDefaultTokensSetterProps {
  onComplete: () => void;
  sassVariables: SassColorVariables;
}

/**
 * Mounts elements with USWDS utility classes in order to read the computed styles.
 * We should do this only once on mount in order to optimize performance.
 */
const ComputedDefaultTokensSetter = ({ onComplete, sassVariables }: ComputedDefaultTokensSetterProps) => {
  const containerRef = useRef<HTMLDivElement>();
  const { setComputedDefaultTokens } = useContext(TokensManagerContext);

  useEffect(() => {
    const elements = containerRef.current.querySelectorAll(
      "span[data-variable]"
    );
    const computedColorTokens: Record<string, string> = {};

    elements.forEach((element) => {
      const computedStyle = getComputedStyle(element);
      const rgb = computedStyle.getPropertyValue("background-color");
      // Browser returns transparent if background-color is empty
      const hex = rgb == "rgba(0, 0, 0, 0)" ? "" : rgbToHex(rgb);

      computedColorTokens[element.getAttribute("data-variable")] = hex;
    });

    setComputedDefaultTokens((prevComputedDefaultTokens) => {
      return {
        ...prevComputedDefaultTokens,
        ...computedColorTokens,
      };
    });

    onComplete();
  }, [containerRef]);

  return (
    <div ref={containerRef}>
      {sassVariables.map((sassVariableName) => (
        <span
          key={sassVariableName}
          data-variable={sassVariableName}
          className={`bg-${sassVariableName.replace("$theme-color-", "")}`}
        />
      ))}
    </div>
  );
};

export default ColorTokens;
