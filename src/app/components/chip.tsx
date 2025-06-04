export function Chip({ text }: { text: string }) {
    const WRAP_LEN = 50;

    return (
        <div
            className={`
            inline-block px-2 py-1 rounded-2xl mr-3 drop-shadow
            ${text.length > WRAP_LEN ? 'whitespace-normal break-words max-w-[300px]' : 'whitespace-nowrap'}
            bg-[var(--chip-green)]
            `}
        >
            {text}
        </div>
    );
}