/* eslint-disable @typescript-eslint/no-explicit-any */
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { FevaVideo } from "./FevaVideo";

/**
 * Video display and draws timeline
 */
export const VideoDisplay: React.FC = () => {
    const [video, setVideo] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const onSelected = (file?: File) => {
        if (file) {
            setVideo((prev) => {
                const localUrl = URL.createObjectURL(file);
                if (prev) {
                    URL.revokeObjectURL(prev);
                }
                return localUrl;
            });
        }
    };

    function changeVideo(e: SyntheticEvent<HTMLInputElement>) {
        const file = (e.target as HTMLInputElement).files?.[0];
        onSelected(file);
    }

    function selectVideo() {
        inputRef.current?.click();
    }

    function initDragDrop(ref: HTMLDivElement | null) {
        if (!ref) return;
        ref.ondragover = ref.ondragenter = (e?: any) => {
            e?.preventDefault();
        };
        ref.ondragleave = ref.ondrop = (e?: any) => {
            e?.preventDefault();
            const droppedFile = e?.dataTransfer?.files?.[0];
            onSelected(droppedFile);
        };
    }

    return (
        <div className="flex items-center justify-center w-full h-full bg-black">
            <div className="h-full aspect-video bg-white relative">
                {!video ? (
                    <div className="border-2 h-full w-full border-dashed border-gray-400">
                        <input
                            ref={inputRef}
                            className="peer top-full absolute left-0 hidden cursor-pointer"
                            type="file"
                            accept="video/*"
                            onChange={changeVideo}
                        />
                        <div
                            ref={(ref) => initDragDrop(ref)}
                            onClick={selectVideo}
                            className="cursor-pointer w-full h-full flex items-center justify-center flex-col bg-gray-100 relative overflow-hidden"
                        >
                            <div className="flex flex-col m-auto relative z-1 items-center justify-center text-gray-600">
                                <i className="ri-file-upload-fill text-5xl" />
                                <span className="font-bold text-xl mt-4">
                                    Drop video
                                </span>
                                <span className="opacity-65 mt-6 text-base">
                                    Drag and drop your video file here.
                                </span>
                            </div>
                            <Grids />
                        </div>
                    </div>
                ) : (
                    <FevaVideo video={video} />
                )}
            </div>
        </div>
    );
};

const Grids: React.FC = () => {
    const gridRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = gridRef.current;
        const container = containerRef.current;
        if (!canvas || !container) {
            throw new Error("dev error");
        }

        const ctx2d = canvas.getContext("2d");
        if (!ctx2d) {
            throw new Error("dev error");
        }

        const { width, height } = container.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;

        for (let i = 0; i < width; i += 20) {
            ctx2d.beginPath();
            ctx2d.moveTo(i, 0);
            ctx2d.lineTo(i, height);
            ctx2d.lineWidth = 1;
            ctx2d.strokeStyle = "#e3e3e3";
            ctx2d.stroke();
            ctx2d.closePath();
        }

        for (let i = 0; i < height; i += 20) {
            ctx2d.beginPath();
            ctx2d.moveTo(0, i);
            ctx2d.lineTo(width, i);
            ctx2d.lineWidth = 1;
            ctx2d.strokeStyle = "#e3e3e3";
            ctx2d.stroke();
            ctx2d.closePath();
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full h-full absolute left-0 top-0 z-0"
        >
            <div className="bg-radial from-transparent to-75% to-gray-100 z-1 absolute left-0 top-0 w-full h-full" />
            <canvas className="w-full h-full relative z-0" ref={gridRef} />
        </div>
    );
};
