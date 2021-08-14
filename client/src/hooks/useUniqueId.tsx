import { uniqueId } from "lodash";
import { useState } from "react";

/**
 * Generate a unique ID. This is often useful for associating field
 * elements like the input, label, and error message, which is
 * important for a11y.
 * @example const id = useUniqueId("choice")
 */
function useUniqueId(prefix: string): string {
  // Store the unique ID as state so that it's not incremented on every render
  const [id] = useState(uniqueId(prefix));

  return id;
}

export default useUniqueId;
