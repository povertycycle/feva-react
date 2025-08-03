import { ChangeEvent, useId } from "react";

interface InputIntervalProps {
    value: number;
    onChange: (value: number) => void;
    children: React.ReactNode;
}

export const InputInterval: React.FC<InputIntervalProps> = ({
    value,
    onChange,
    children,
}) => {
    const id = useId();
    const onInput = (e: ChangeEvent<HTMLInputElement>) => {
        const valid = new RegExp(/^\d*$/);
        if (valid) {
            const newValue = parseInt(e.target.value);
            onChange(newValue);
        }
    };

    return (
        <div className="flex gap-2 items-center">
            <input
                id={id}
                type="text"
                className="focus:outline-gray-400 border border-gray-300 rounded-sm w-16 h-8 p-1"
                value={value}
                onChange={onInput}
            />
            <label htmlFor={id}>{children}</label>
        </div>
    );
};
