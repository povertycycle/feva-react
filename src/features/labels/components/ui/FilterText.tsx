/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, useEffect, useState } from "react";
interface FilterTextProps {
    filterByText: (text: string) => void;
}

export const FilterText: React.FC<FilterTextProps> = ({ filterByText }) => {
    const [input, setInput] = useState<string | null>(null);

    useEffect(() => {
        if (input === null) return;
        const tID: NodeJS.Timeout = setTimeout(() => {
            filterByText(input);
        }, 250);

        return () => {
            clearTimeout(tID);
        };
    }, [input]);

    const changeInput = (e: ChangeEvent<HTMLInputElement>) => {
        setInput((e.target as HTMLInputElement).value);
    };

    return (
        <input
            onChange={changeInput}
            type="text"
            value={input ?? ""}
            className="focus:outline-gray-400 border border-gray-300 rounded-sm px-2 h-full placeholder:text-gray-400"
            placeholder="Search label"
        />
    );
};
