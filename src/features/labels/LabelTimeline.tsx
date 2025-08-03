/* eslint-disable @typescript-eslint/no-explicit-any */
import { LABEL_CONTAINER, VIDEO_TIMELINE } from "@/constants/portals";
import { SECTION_HEADER_WIDTH } from "@/constants/settings";
import React, { useEffect, useRef } from "react";
import { DatasetTimeline } from "./DatasetTimeline";

export const LabelTimeline: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onWheel = (e: any) => {
            if (!scrollRef.current) return;
            if (e.shiftKey) {
                e.preventDefault();
                scrollRef.current.scrollLeft -= e.deltaY;
            }
        };
        scrollRef.current?.addEventListener("wheel", onWheel);
    }, []);

    return (
        <div
            ref={scrollRef}
            id={LABEL_CONTAINER}
            className="w-full h-0 grow overflow-y-auto grid grid-rows-[min-content_auto]"
        >
            <div
                id={VIDEO_TIMELINE}
                className="flex shrink-0"
                style={{ paddingLeft: `${SECTION_HEADER_WIDTH}px` }}
            />
            <DatasetTimeline />
        </div>
    );
};
