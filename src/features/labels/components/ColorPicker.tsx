import { useState } from "react";
import { ColorResult, SketchPicker } from "react-color";

export const ColorPicker: React.FC<{
    color: string;
    updateColor: (color: string) => void;
    isDark: boolean;
}> = ({ color, updateColor, isDark }) => {
    const [display, setDisplay] = useState<boolean>(false);

    const toggle = () => setDisplay((prev) => !prev);
    const closePopup = () => setDisplay(false);

    const selectColor = (color: ColorResult) => {
        updateColor(color.hex);
    };

    return (
        <>
            <div
                className={`relative z-1 h-full aspect-square flex rounded-sm cursor-pointer max-h-8 ${
                    isDark
                        ? "bg-white/20 hover:bg-white/30 text-white"
                        : "bg-black/10 hover:bg-black/20 text-black"
                }`}
                onClick={toggle}
            >
                <i className="ri-brush-line text-xl m-auto" />
            </div>
            {display ? (
                <div className="absolute z-50 top-full">
                    <div
                        className="fixed top-0 left-0 bottom-0 right-0"
                        onClick={closePopup}
                    />
                    <SketchPicker
                        disableAlpha
                        presetColors={[]}
                        color={color}
                        onChange={selectColor}
                    />
                </div>
            ) : null}
        </>
    );
};
