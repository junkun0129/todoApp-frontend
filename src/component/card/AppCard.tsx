import { Card } from "antd";
import React, { CSSProperties, ReactNode } from "react";
type Props = { children: ReactNode; style?: CSSProperties; className?: string };
const AppCard = ({ children, style, className }: Props) => {
  return (
    <Card
      className={className}
      style={{
        boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)",
        ...style,
      }}
    >
      {children}
    </Card>
  );
};

export default AppCard;
