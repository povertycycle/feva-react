import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Label, Section } from "../../interfaces/dataset";

interface ListDisplayProps {
    label: Label;
    section: Pick<Section, "id" | "color">;
    updateLabel: (label: Label) => void;
}

export const ListDisplay: React.FC<ListDisplayProps> = ({
    label,
    updateLabel,
    section,
}) => {
    const [edit, setEdit] = useState<Label | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (edit) {
            inputRef.current?.focus();
        }
    }, [edit]);

    const goToEdit = () => {
        setEdit(label);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEdit((prev) => (prev ? { ...prev, text: e.target.value } : prev));
    };

    const saveChanges = () => {
        if (edit) {
            updateLabel(edit);
            setEdit(null);
        }
    };

    return (
        <div
            data-label-text={label.text}
            data-label-section={section.id}
            className="w-full h-8 border-b border-gray-300 bg-white flex items-center group"
        >
            <div
                style={{
                    background: section.color,
                }}
                className="h-full w-4"
            />
            {!edit ? (
                <>
                    <span className="px-2 truncate">{label.text}</span>
                    <i
                        onClick={goToEdit}
                        className="ri-pencil-line ml-auto mr-2 invisible text-gray-300 cursor-pointer hover:text-gray-500 group-hover:visible"
                    />
                </>
            ) : (
                <>
                    <input
                        ref={inputRef}
                        type="text"
                        className="w-full h-full px-2.5 focus:outline-gray-500 placeholder:text-gray-300"
                        placeholder="Label title"
                        value={edit.text}
                        onChange={handleChange}
                    />
                    <button
                        onClick={saveChanges}
                        className="h-full aspect-square ml-auto hover:bg-gray-200 cursor-pointer"
                    >
                        <i className="ri-save-line" />
                    </button>
                </>
            )}
        </div>
    );
};
