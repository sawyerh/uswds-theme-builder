import { ComponentType } from "react";
import classnames from "classnames";

interface IconButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon: ComponentType;
  iconProps?: any;
}

const IconButton = (props: IconButtonProps) => {
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
