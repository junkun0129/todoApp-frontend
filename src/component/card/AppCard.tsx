import { Card } from "antd";
import React, { CSSProperties, ReactNode } from "react";
type Props = {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  bgColor?: string;
};
const AppCard = ({ children, style, className, bgColor = "white" }: Props) => {
  return (
    <Card
      className={className}
      style={{
        boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)",
        ...style,
        backgroundColor: bgColor,
      }}
    >
      {children}
    </Card>
  );
};

export default AppCard;
