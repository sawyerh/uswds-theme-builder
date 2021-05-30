import "uswds";

/**
 * USWDS JS references DOM API's which break SSR, so we import it in a hacky way
 */
const ScriptsForUSWDS = () => {
  return null;
};

export default ScriptsForUSWDS;
