import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import lzString from "lz-string";
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

  /**
   * Parse and store the token tokens from the URL query param
   */
  useEffect(() => {
    if (!router.isReady) return;
    const tokensObject = parseTokensFromQuery();
    setTokens(tokensObject);
  }, [router.isReady]);

  const handleChange = (event) => {
    const updatedTokens = {
      ...tokens,
      [event.target.name]: event.target.value,
    };

    setTokens(updatedTokens);
    debouncedUpdateTokensQuery(updatedTokens);
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
   * @param {object} updatedTokens
   */
  const updateTokensQuery = (updatedTokens) => {
    const url = new URL(window.location);

    url.searchParams.set(
      "tokens",
      lzString.compressToEncodedURIComponent(JSON.stringify(updatedTokens))
    );
    router.push(url.href);
  };

  /**
   * Debounced version of our top-level change handler. Each input
   * has its own change handler that is fired on every change, so we
   * only need a debounced version to store the value in the global state
   */
  const debouncedUpdateTokensQuery = useCallback(
    debounce((updatedTokens) => updateTokensQuery(updatedTokens), 1000),
    []
  );

  return {
    handleChange,
    tokens,
  };
}

export default useTokensManager;
