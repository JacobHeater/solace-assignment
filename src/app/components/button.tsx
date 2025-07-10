import { ReactNode } from "react";

interface ButtonProps {
    onClick: () => void;
    children: ReactNode;
    className?: string;
}

export function Button({ onClick, children, className }: ButtonProps) {
    return (
        <button
            className={`bg-[var(--solace-green)] text-[var(--solace-foreground)] py-1 px-2 rounded drop-shadow active:drop-shadow-none ${className}`}
            onClick={() => onClick()}>{children}</button>
    )
}