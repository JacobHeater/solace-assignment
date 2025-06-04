import { ReactNode } from "react";

export function Button({ onClick, children }: { onClick: () => void, children: ReactNode }) {
    return (
        <button
            className="bg-[var(--solace-green)] text-[var(--solace-foreground)] ml-8 py-1 px-2 rounded drop-shadow active:drop-shadow-none"
            onClick={() => onClick()}>{children}</button>
    )
}