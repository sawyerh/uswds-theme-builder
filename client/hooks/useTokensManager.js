import { useEffect, useState } from "react";
import { get } from "lodash";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/router";

/**
 * State manager for the Sass tokens. Facilitates caching of the
 * tokens in the URL query param
 * @returns {object}
 */
function useTokensManager() {
  const router = useRouter();
  const query = router.query;
  /**
   * Custom theme variable values set by the user
   */
  const [customTokens, setCustomTokens] = useState(null);
  /**
   * CSS values for theme variables set by USWDS as defaults
   */
  const [computedDefaultTokens, setComputedDefaultTokens] = useState({});

  const [debouncedCustomTokens] = useDebounce(customTokens, 750);

  /**
   * Parse and store the tokens from the URL query param
   */
  useEffect(() => {
    if (!router.isReady) return;
    const tokensObject = parseTokensFromQuery();
    setCustomTokens(tokensObject);
  }, [router.isReady]);

  /**
   * Update the query string when the tokens change. Use the debounced
   * version of these tokens as the trigger, so we don't send a bunch
   * of expensive API requests every time a field changes
   */
  useEffect(() => {
    updateTokensQuery();
  }, [debouncedCustomTokens]);

  /**
   * Read the value of a token, either set by the user or the computed value
   * of the USWDS default
   * @param {string} name - Theme variable name
   * @returns {string}
   */
  const getTokenValue = (name) => {
    const value = get(customTokens, name) || get(computedDefaultTokens, name);

    if (value) return value;
    return "";
  };

  const setCustomToken = (name, value) => {
    setCustomTokens((prevCustomTokens) => {
      return {
        ...prevCustomTokens,
        [name]: value,
      };
    });
  };

  const handleChange = (event) => {
    setCustomToken(event.target.name, event.target.value);
  };

  /**
   * Read the tokens JSON from the query param
   * @returns {object}
   */
  const parseTokensFromQuery = () => {
    if (!query.tokens) return;

    try {
      const tokensObject = JSON.parse(query.tokens);
      return tokensObject;
    } catch (error) {
      console.error(error);
      return {};
    }
  };

  /**
   * Save the changed token to the URL query param
   */
  const updateTokensQuery = () => {
    const url = new URL(window.location);
    const queryParamName = "tokens";

    if (customTokens && Object.entries(customTokens).length) {
      url.searchParams.set(queryParamName, JSON.stringify(customTokens));
    } else {
      url.searchParams.delete(queryParamName);
    }

    router.push(url.href, undefined, { scroll: false, shallow: true });
  };

  return {
    getTokenValue,
    handleChange,
    setComputedDefaultTokens,
    setCustomToken,
    setCustomTokens,
    customTokens,
  };
}

export default useTokensManager;
