/* eslint-disable react-hooks/exhaustive-deps */
import { SECTION_HEADER_WIDTH } from "@/constants/settings";
import { ChangeEvent, useEffect, useState } from "react";
import { ColorPicker } from "./components/ColorPicker";
import { getRandomColor, isDark } from "./utils/colors";

export const AddNewSection: React.FC<{
    addSection: (title: string, color: string) => void;
}> = ({ addSection }) => {
    const [title, setTitle] = useState<string>("");
    const [color, setColor] = useState<string>("");
    const textDark = isDark(color);

    useEffect(() => {
        if (!color) {
            setColor(getRandomColor());
        }
    }, []);

    const updateColor = (newColor: string) => {
        setColor(newColor);
    };

    const add = () => {
        addSection(title ?? "", color);
        setTitle("");
        setColor(getRandomColor());
    };

    return (
        <div
            className="sticky left-0 h-12 flex p-2 gap-2"
            style={{
                width: `${SECTION_HEADER_WIDTH}px`,
                background: color,
            }}
        >
            <ColorPicker
                color={color}
                updateColor={updateColor}
                isDark={textDark}
            />
            <div className="h-full w-0 grow overflow-hidden relative z-2 flex gap-2 bg-white rounded-sm">
                <input
                    value={title}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setTitle(e.target.value)
                    }
                    placeholder="Untitled"
                    className={`focus:outline-none h-full px-2.5 py-0.5 text-xl w-full`}
                    type="text"
                />
            </div>
            <button
                onClick={add}
                className={`flex h-full aspect-square rounded-sm relative cursor-pointer ${
                    textDark
                        ? "bg-white/20 hover:bg-white/30 text-white"
                        : "bg-black/10 hover:bg-black/20 text-black"
                }`}
            >
                <i className="ri-add-line m-auto text-xl" />
            </button>
        </div>
    );
};

{
    /* <div
            className="sticky left-0 h-12 flex p-2 gap-2"
            style={{
                width: `${SECTION_HEADER_WIDTH}px`,
                style={{ background: color }}
                color: textDark ? "#ffffff" : "#000000",
            }}
        >
            <div className="h-full w-0 grow overflow-hidden relative z-2 flex gap-2">
                <input
                    ref={inputRef}
                    value={title}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setTitle(e.target.value)
                    }
                    placeholder="Untitled"
                    className={`focus:outline-none h-full px-2.5 py-0.5 text-xl w-full border-b ${
                        textDark
                            ? "placeholder:text-white/50 border-white/50"
                            : "placeholder:text-black/50 border-black/50"
                    }`}
                    type="text"
                />
                <button
                    onClick={() => inputRef.current?.focus()}
                    className={`flex h-full aspect-square rounded-sm relative cursor-pointer ${
                        textDark
                            ? "bg-white/20 hover:bg-white/30"
                            : "bg-black/10 hover:bg-black/20"
                    }`}
                >
                    <i className="ri-pencil-line text-xl m-auto" />
                </button>
            </div>
            <ColorPicker
                color={color}
                updateColor={updateColor}
                isDark={textDark}
            />
            <button
                onClick={add}
                className={`flex h-full aspect-square rounded-sm relative cursor-pointer ${
                    textDark
                        ? "bg-white/20 hover:bg-white/30"
                        : "bg-black/10 hover:bg-black/20"
                }`}
            >
                <i className="ri-add-line m-auto text-xl" />
            </button>
        </div> */
}
