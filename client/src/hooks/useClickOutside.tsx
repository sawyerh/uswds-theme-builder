import type { MutableRefObject } from "react";
import { useEffect } from "react";

const useClickOutside = (ref: MutableRefObject<any>, handleClickOutside: () => void) => {
  useEffect(() => {
    let startedInside = false;
    let startedWhenMounted = false;

    const handleClick = (event: MouseEvent) => {
      // Do nothing if `mousedown` or `touchstart` started inside ref element
      if (startedInside || !startedWhenMounted) return;
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) return;

      handleClickOutside();
    };

    const validateEventStart = (event) => {
      startedWhenMounted = ref.current;
      startedInside = ref.current && ref.current.contains(event.target);
    };

    document.addEventListener("mousedown", validateEventStart);
    document.addEventListener("touchstart", validateEventStart);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("mousedown", validateEventStart);
      document.removeEventListener("touchstart", validateEventStart);
      document.removeEventListener("click", handleClick);
    };
  }, [ref, handleClickOutside]);
};

export default useClickOutside;
