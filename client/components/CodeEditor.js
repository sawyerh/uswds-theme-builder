import { Code, CodeSimple } from "phosphor-react";
import { useState } from "react";
import IconButton from "./IconButton";
import classNames from "classnames";
import dynamic from "next/dynamic";

if (typeof window !== "undefined") {
  require("codemirror/mode/xml/xml");
}

const CodeMirror = dynamic(() =>
  import("react-codemirror2").then((mod) => mod.Controlled)
);

const CodeEditor = (props) => {
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
            onBeforeChange={props.onChange}
            options={{
              mode: "xml",
              theme: "vibrant-ink",
              lineNumbers: true,
            }}
            value={props.value}
          />
        </div>
      ) : null}
    </>
  );
};

export default CodeEditor;
