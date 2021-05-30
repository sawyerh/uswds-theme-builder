import PropTypes from "prop-types";
import React, { useState } from "react";
import useUniqueId from "../hooks/useUniqueId";

/**
 * An accordion is a list of headers that hide or reveal additional content when selected.
 * [USWDS Reference ↗](https://designsystem.digital.gov/components/accordion/)
 */
export function AccordionItem(props) {
  const id = useUniqueId("accordion");
  const [isExpanded, setExpanded] = useState(false);

  function handleClick() {
    setExpanded(!isExpanded);
  }

  return (
    <React.Fragment>
      <h2 className="usa-accordion__heading font-body-xs">
        <button
          className="usa-accordion__button"
          aria-expanded={isExpanded.toString()}
          aria-controls={id}
          onClick={handleClick}
          type="button"
        >
          {props.heading}
        </button>
      </h2>
      <div id={id} className="usa-accordion__content" hidden={!isExpanded}>
        {props.children}
      </div>
    </React.Fragment>
  );
}

AccordionItem.propTypes = {
  children: PropTypes.node.isRequired,
  heading: PropTypes.string.isRequired,
};

/**
 * An accordion is a list of headers that hide or reveal additional content when selected.
 * [USWDS Reference ↗](https://designsystem.digital.gov/components/accordion/)
 */
function Accordion(props) {
  return (
    <div
      className="usa-accordion usa-accordion--bordered"
      aria-multiselectable="true"
    >
      {props.children}
    </div>
  );
}

Accordion.propTypes = {
  /**
   * One or more `AccordionItem` elements
   */
  children: PropTypes.node.isRequired,
};

export default Accordion;
