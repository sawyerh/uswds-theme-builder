import { ReactNode } from "react";

interface PanelHeadingProps {
  children: ReactNode;
}

const PanelHeading = ({ children }: PanelHeadingProps) => {
  return (
    <h2 className="text-white font-sans-lg margin-bottom-1 margin-top-0">
      {children}
    </h2>
  );
};

export default PanelHeading;
