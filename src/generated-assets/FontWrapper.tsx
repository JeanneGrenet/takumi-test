import React, { type ReactNode } from "react";

interface FontWrapperProps {
  children: ReactNode;
  style?: React.CSSProperties;
}

export default function FontWrapper({ children, style }: FontWrapperProps) {
  return (
    <div
      style={{
        fontFamily: "Geist, Thai, Jap, KR, Arabic, sans-serif",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
