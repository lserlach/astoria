import type { ReactNode } from "react";

import styles from "./container.module.css";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={`${styles.container} ${className ?? ""}`.trim()}>
      {children}
    </div>
  );
}
