import { Code, CodeSimple } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import IconButton from "./IconButton";
import classNames from "classnames";
import dynamic from "next/dynamic";
import formatHtml from "../utils/formatHtml";
import { useDebouncedCallback } from "use-debounce";

if (typeof window !== "undefined") {
  require("codemirror/mode/xml/xml");
}

const CodeMirror = dynamic(() =>
  import("react-codemirror2").then((mod) => mod.UnControlled)
);

const CodeEditor = (props) => {
  const { initialValue, onChange } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const handleToggleClick = () => setIsExpanded(!isExpanded);
  const editorRef = useRef();

  const handleChange = useDebouncedCallback((_editor, _data, value) => {
    onChange(value);
  }, 1000);

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
  };

  /**
   * Format code on CMD+S
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      const cmdOrCtrl = navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && e.keyCode === 83) {
        e.preventDefault();
        const value = editorRef.current.getValue();
        const formattedValue = formatHtml(value);
        editorRef.current.setValue(formattedValue);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className="text-right">
        <IconButton
          className="padding-105 text-white"
          icon={isExpanded ? Code : CodeSimple}
          onClick={handleToggleClick}
        >
          {isExpanded ? "Hide" : "Show"} HTML Editor
        </IconButton>
      </div>
      {isExpanded ? (
        <div className={classNames("font-mono-md")}>
          <CodeMirror
            editorDidMount={handleEditorMount}
            onChange={handleChange}
            options={{
              mode: "xml",
              theme: "vibrant-ink",
              lineNumbers: true,
            }}
            value={initialValue}
          />
        </div>
      ) : null}
    </>
  );
};

export default CodeEditor;
