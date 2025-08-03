/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SettingsContext } from "@/stores/settings";
import { ChangeEvent, MouseEvent, useContext, useRef, useState } from "react";
import { LABEL_HEIGHT } from "../../constants/label";
import { Label } from "../../interfaces/dataset";
import { checkHasChanges } from "../../utils/labels";

interface StripDisplayProps {
    label: Label;
    top: number;
    color: string;
    updateLabel: (label: Label) => void;
}

export const StripDisplay: React.FC<StripDisplayProps> = ({
    label,
    top,
    color,
    updateLabel,
}) => {
    const {
        settings: { timeInterval, intervalGap },
    } = useContext(SettingsContext);
    const [focused, setFocused] = useState<Label | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const hasChanges = !!focused && checkHasChanges(focused, label);

    const dt = label.endTime - label.startTime;
    const left = (label.startTime / timeInterval) * intervalGap;
    const width = (dt / timeInterval) * intervalGap;

    const focusLabel = (evt: any) => {
        evt.stopPropagation();
        if (!focused) {
            console.log("focusing");
            setFocused(label);
        }
    };

    const setPreviewValue = (key: string, value: any) => {
        setFocused((prev) => (prev ? { ...prev, [key]: value } : null));
    };

    const saveChanges = () => {
        if (focused && hasChanges) {
            updateLabel(focused);
        }
        setFocused(null);
    };

    return (
        <div
            ref={containerRef}
            data-focus={!!focused}
            className={`bg-white absolute text-sm/5 flex data-focus:outline-gray-300 data-focus:outline`}
            style={{
                width,
                left,
                height: `${LABEL_HEIGHT}px`,
                top: `${8 + top * (LABEL_HEIGHT + 4)}px`,
            }}
        >
            {focused && (
                <DragArea
                    init={{
                        width,
                        color,
                        startTime: label.startTime,
                    }}
                    setPreviewValue={setPreviewValue}
                    saveChanges={saveChanges}
                />
            )}
            <div className="w-full h-full overflow-hidden flex relative z-2">
                {focused ? (
                    <input
                        value={focused.text}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setFocused((prev) =>
                                prev ? { ...prev, text: e.target.value } : null
                            )
                        }
                        type="text"
                        className="peer pl-2 pr-10 pt-px w-full h-full focus:outline-gray-500"
                    />
                ) : (
                    <div
                        onClick={focusLabel}
                        className="w-full h-full flex overflow-hidden"
                    >
                        <span className="truncate my-auto px-2 pt-0.5">
                            {label.text}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

const DragArea: React.FC<{
    init: {
        width: number;
        color: string;
        startTime: number;
    };
    saveChanges: () => void;
    setPreviewValue: (key: string, value: any) => void;
}> = ({ init: { width, color, startTime }, saveChanges, setPreviewValue }) => {
    const {
        settings: { intervalGap, timeInterval },
    } = useContext(SettingsContext);
    const anchorRef = useRef<{
        clientX: number;
        left: number;
        width: number;
    } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);
    const middleRef = useRef<HTMLDivElement>(null);

    function initDown(e: any) {
        if (!containerRef.current || !leftRef.current || !rightRef.current) {
            throw new Error("dev-error");
        }
        const { width } = containerRef.current.getBoundingClientRect();
        const left = parseInt(containerRef.current.style.left);
        anchorRef.current = { clientX: e.clientX, left, width };
        containerRef.current.style.background = `${color}3e`;
    }

    function processUp() {
        if (!containerRef.current || !leftRef.current || !rightRef.current) {
            throw new Error("dev-error");
        }
        anchorRef.current = null;
    }

    const onLeftDown = (e: MouseEvent<HTMLDivElement>) => {
        if (!leftRef.current) throw new Error("dev-error");
        initDown(e);

        const mouseMove = (e: any) => {
            console.log("move");
            if (!anchorRef.current || !containerRef.current) {
                throw new Error("dev-error");
            }
            const disp = anchorRef.current.clientX - e.clientX;
            const newWidth = anchorRef.current.width + disp;
            const newLeft = anchorRef.current.left - disp;
            containerRef.current.style.width = `${newWidth}px`;
            containerRef.current.style.left = `${newLeft}px`;
        };

        const mouseUp = () => {
            if (!containerRef.current || !leftRef.current) {
                throw new Error("dev-error");
            }
            const changes = parseInt(containerRef.current.style.left);
            const dT = (changes / intervalGap) * timeInterval;
            console.log(changes, anchorRef.current?.left, dT);

            setPreviewValue("startTime", startTime + dT);
            processUp();

            leftRef.current.removeEventListener("mousemove", mouseMove);
            leftRef.current.removeEventListener("mouseup", mouseUp);
        };

        leftRef.current.addEventListener("mousemove", mouseMove);
        leftRef.current.addEventListener("mouseup", mouseUp);
    };

    const onRightDown = (e: MouseEvent<HTMLDivElement>) => {
        if (!rightRef.current) throw new Error("dev-error");
        initDown(e);

        const mouseMove = (e: any) => {
            console.log("move");
            if (!anchorRef.current || !containerRef.current) {
                throw new Error("dev-error");
            }
            const disp = anchorRef.current.clientX - e.clientX;
            const newWidth = anchorRef.current.width - disp;
            containerRef.current.style.width = `${newWidth}px`;
        };

        const mouseUp = () => {
            if (!containerRef.current || !rightRef.current) {
                throw new Error("dev-error");
            }
            const newWidth = parseInt(containerRef.current.style.width);
            const dT = (newWidth / intervalGap) * timeInterval;
            console.log(newWidth, dT, startTime);

            const stChanges = parseInt(containerRef.current.style.left);
            const dST = (stChanges / intervalGap) * timeInterval;
            setPreviewValue("endTime", startTime + dT + dST);
            processUp();

            rightRef.current.removeEventListener("mousemove", mouseMove);
            rightRef.current.removeEventListener("mouseup", mouseUp);
        };

        rightRef.current.addEventListener("mousemove", mouseMove);
        rightRef.current.addEventListener("mouseup", mouseUp);
    };

    const onMiddleDown = (e: any) => {
        if (!middleRef.current) throw new Error("dev-error");
        initDown(e);

        const mouseMove = (e: any) => {
            console.log("move");
            if (!anchorRef.current || !containerRef.current) {
                throw new Error("dev-error");
            }
            const disp = anchorRef.current.clientX - e.clientX;
            const newLeft = anchorRef.current.left - disp;
            containerRef.current.style.left = `${newLeft}px`;
        };

        const mouseUp = () => {
            if (
                !containerRef.current ||
                !middleRef.current ||
                !anchorRef.current
            ) {
                throw new Error("dev-error");
            }
            const changes = parseInt(containerRef.current.style.left);
            const { width } = anchorRef.current;
            const dT = (changes / intervalGap) * timeInterval;
            const dur = (width / intervalGap) * timeInterval;
            console.log(changes, anchorRef.current?.left, dT);

            setPreviewValue("startTime", startTime + dT);
            setPreviewValue("endTime", startTime + dT + dur);
            processUp();

            middleRef.current.removeEventListener("mousemove", mouseMove);
            middleRef.current.removeEventListener("mouseup", mouseUp);
        };

        middleRef.current.addEventListener("mousemove", mouseMove);
        middleRef.current.addEventListener("mouseup", mouseUp);
    };

    return (
        <div
            ref={containerRef}
            style={{
                width,
                left: 0,
            }}
            className="z-3 absolute h-full flex"
        >
            <div
                ref={leftRef}
                onMouseDown={onLeftDown}
                className="outline outline-gray-300 cursor-grab top-0 flex absolute right-full h-full w-6 bg-white rounded-l-sm"
            >
                <i className="ri-expand-left-line m-auto px-1" />
            </div>
            <div
                onMouseDown={onMiddleDown}
                className="w-full h-full cursor-grab"
                ref={middleRef}
            />
            <div
                ref={rightRef}
                onMouseDown={onRightDown}
                className="outline outline-gray-300 cursor-grab top-0 absolute left-full flex h-full w-6 bg-white rounded-r-sm"
            >
                <i className="ri-expand-right-line m-auto px-1" />
            </div>
            <button
                onClick={saveChanges}
                className="h-full aspect-square flex cursor-pointer"
            >
                <i className="ri-save-line m-auto" />
            </button>
        </div>
    );
};
