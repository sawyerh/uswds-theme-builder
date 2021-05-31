import { Code, CodeSimple } from "phosphor-react";
import { useState } from "react";
import IconButton from "./IconButton";
import classNames from "classnames";
import dynamic from "next/dynamic";

const CodeMirror = dynamic(() =>
  import("react-codemirror2").then((mod) => mod.UnControlled)
);

const CodeEditor = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleToggleClick = () => setIsExpanded(!isExpanded);

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
            value="<h1>I ♥ react-codemirror2</h1>"
            options={{
              mode: "xml",
              theme: "vibrant-ink",
              lineNumbers: true,
            }}
          />
        </div>
      ) : null}
    </>
  );
};

export default CodeEditor;
