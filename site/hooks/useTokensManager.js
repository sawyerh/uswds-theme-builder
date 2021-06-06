import { useEffect, useState } from "react";
import lzString from "lz-string";
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
  const [tokens, setTokens] = useState({});
  const [debouncedTokens] = useDebounce(tokens, 1000);

  /**
   * Parse and store the tokens from the URL query param
   */
  useEffect(() => {
    if (!router.isReady) return;
    const tokensObject = parseTokensFromQuery();
    setTokens(tokensObject);
  }, [router.isReady]);

  /**
   * Update the query string when the tokens change. Use the debounced
   * version of these tokens as the trigger, so we don't send a bunch
   * of expensive API requests every time a field changes
   */
  useEffect(() => {
    updateTokensQuery();
  }, [debouncedTokens]);

  const setToken = (name, value) => {
    const updatedTokens = {
      ...tokens,
      [name]: value,
    };

    setTokens(updatedTokens);
  };

  const handleChange = (event) => {
    setToken(event.target.name, event.target.value);
  };

  /**
   * Read the tokens JSON from the query param
   * @returns {object}
   */
  const parseTokensFromQuery = () => {
    if (!query.tokens) return;

    const decodedTokensParam = lzString.decompressFromEncodedURIComponent(
      query.tokens
    );

    try {
      const tokensObject = JSON.parse(decodedTokensParam);
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

    if (tokens && Object.entries(tokens).length) {
      url.searchParams.set(
        queryParamName,
        lzString.compressToEncodedURIComponent(JSON.stringify(tokens))
      );
    } else {
      url.searchParams.delete(queryParamName);
    }
    router.push(url.href);
  };

  return {
    handleChange,
    setToken,
    tokens,
  };
}

export default useTokensManager;
