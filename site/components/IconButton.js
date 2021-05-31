import classnames from "classnames";

const IconButton = (props) => {
  const { children, className, icon: Icon, iconProps, ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      type="button"
      className={classnames("text-no-wrap usa-button--unstyled", className)}
    >
      <span className="display-inline-block text-middle margin-right-05">
        <Icon {...iconProps} size={16} />
      </span>
      {children}
    </button>
  );
};

export default IconButton;
