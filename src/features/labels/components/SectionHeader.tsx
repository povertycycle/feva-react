import { SECTION_HEADER_WIDTH } from "@/constants/settings";
import { ChangeEvent, useRef, useState } from "react";
import { isDark } from "../utils/colors";
import { ColorPicker } from "./ColorPicker";

interface SectionHeaderProps {
    id: string;
    title: string;
    color: string;
    updateSection: (id: string, title: string, color: string) => void;
    deleteSection: (id: string) => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    id,
    title,
    color,
    updateSection,
    deleteSection,
}) => {
    const [editMode, setEditMode] = useState<{
        title: string;
        color: string;
    } | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const textDark = isDark(editMode?.color ?? color);

    const setEdit = () => {
        setEditMode({
            title,
            color,
        });
    };

    const setDelete = () => {
        deleteSection(id);
    };

    const saveChanges = () => {
        if (editMode) {
            updateSection(id, editMode.title, editMode.color);
            setEditMode(null);
        }
    };

    return (
        <div
            className="h-full min-h-12 flex sticky left-0 top-0 shrink-0 z-10 gap-2 p-2"
            style={{
                background: editMode?.color ?? color,
                width: `${SECTION_HEADER_WIDTH}px`,
            }}
        >
            {editMode ? (
                <>
                    <div className="h-full w-0 grow overflow-hidden relative z-2 flex gap-2">
                        <input
                            ref={inputRef}
                            value={editMode.title}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setEditMode({
                                    ...editMode,
                                    title: e.target.value,
                                })
                            }
                            placeholder="Untitled"
                            className={`focus:outline-none h-full max-h-8 px-2.5 py-0.5 text-xl w-full bg-white rounded-sm`}
                            type="text"
                        />
                        <button
                            onClick={() => inputRef.current?.focus()}
                            className={`flex h-full aspect-square rounded-sm relative cursor-pointer max-h-8 ${
                                textDark
                                    ? "bg-white/20 hover:bg-white/30 text-white"
                                    : "bg-black/10 hover:bg-black/20 text-black"
                            }`}
                        >
                            <i className="ri-pencil-line text-xl m-auto" />
                        </button>
                    </div>
                    <ColorPicker
                        color={editMode.color}
                        updateColor={(color: string) => {
                            setEditMode({
                                ...editMode,
                                color,
                            });
                        }}
                        isDark={textDark}
                    />
                    <button
                        title="Save changes"
                        onClick={saveChanges}
                        className={`flex h-full aspect-square rounded-sm relative cursor-pointer max-h-8 ${
                            textDark
                                ? "bg-white/20 hover:bg-white/30 text-white"
                                : "bg-black/10 hover:bg-black/20 text-black"
                        }`}
                    >
                        <i className="ri-save-line m-auto text-xl" />
                    </button>
                </>
            ) : (
                <>
                    <div className="bg-white rounded-sm px-2.5 flex text-xl/8 font-medium w-0 grow h-fit">
                        <span className="truncate">{title}</span>
                    </div>
                    <button
                        onClick={setDelete}
                        className={`flex h-full aspect-square rounded-sm relative cursor-pointer group max-h-8 ${
                            textDark
                                ? "bg-white/10 hover:bg-white/20 text-white"
                                : "bg-black/5 hover:bg-black/10 text-black"
                        }`}
                    >
                        <i className="ri-delete-bin-line text-xl m-auto opacity-50 group-hover:opacity-100" />
                    </button>
                    <button
                        onClick={setEdit}
                        className={`flex h-full aspect-square rounded-sm relative cursor-pointer group max-h-8 ${
                            textDark
                                ? "bg-white/10 hover:bg-white/20 text-white"
                                : "bg-black/5 hover:bg-black/10 text-black"
                        }`}
                    >
                        <i className="ri-edit-box-line text-xl m-auto opacity-50 group-hover:opacity-100" />
                    </button>
                </>
            )}
        </div>
    );
};
