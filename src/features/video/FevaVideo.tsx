/* eslint-disable react-hooks/exhaustive-deps */
import { LABEL_CONTAINER, VIDEO_ID, VIDEO_TIMELINE } from "@/constants/portals";
import { SettingsContext } from "@/stores/settings";
import { MouseEvent, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toHHMMSSMS } from "./utils/time";
import { CANVAS_WIDTH, SECTION_HEADER_WIDTH } from "@/constants/settings";

const TIMELINE_HEIGHT = 32;

interface FevaVideoProps {
    video: string;
}

export const FevaVideo: React.FC<FevaVideoProps> = ({ video }) => {
    const {
        settings: { timeInterval, intervalGap },
    } = useContext(SettingsContext);
    const [duration, setDuration] = useState<number>(0);
    const videoEl = useRef<HTMLVideoElement | null>(null);
    const labelContainer = useRef<HTMLDivElement | null>(null);
    const ratio = intervalGap / (timeInterval / 1000);
    const interval = useRef<NodeJS.Timeout | undefined>(undefined);

    const handleLoadedMetadata = () => {
        const elem = videoEl.current;
        if (!elem) return;
        setDuration(Math.ceil(elem.duration));

        const container = document.getElementById(
            LABEL_CONTAINER
        ) as HTMLDivElement;
        labelContainer.current = container;
    };

    const onPlay = () => {
        const elem = videoEl.current;
        if (!elem) return;
        interval.current = setInterval(() => {
            const newTime = videoEl.current?.currentTime;
            if (labelContainer.current) {
                labelContainer.current.scrollLeft = (newTime ?? 0) * ratio;
            }
            console.log("scrolling");
        }, 16);
    };

    const onPause = () => {
        clearInterval(interval.current);
    };

    const onSeeked = () => {
        const elem = videoEl.current;
        if (!elem) return;
        const newTime = videoEl.current?.currentTime;
        if (labelContainer.current) {
            labelContainer.current.scrollLeft = (newTime ?? 0) * ratio;
        }
    };

    return (
        <>
            <video
                id={VIDEO_ID}
                ref={videoEl}
                onPlay={onPlay}
                onPause={onPause}
                onEnded={onPause}
                onSeeked={onSeeked}
                onLoadedMetadata={handleLoadedMetadata}
                src={video}
                className="w-full h-full object-cover aspect-video"
                controls
            />
            {duration && <Timeline duration={duration} />}
        </>
    );
};

const Timeline: React.FC<{ duration: number }> = ({ duration }) => {
    const {
        settings: { timeInterval, intervalGap },
    } = useContext(SettingsContext);
    const elem: HTMLElement | null = document?.getElementById(VIDEO_TIMELINE);

    const VideoTimeline: React.FC = () => {
        const canvases = [];
        const pxRequired = duration * 1000 * (intervalGap / timeInterval);
        const numOfCanvases = Math.ceil(pxRequired / CANVAS_WIDTH);

        for (let i = 0; i < numOfCanvases; i++) {
            const startTime = ((i * CANVAS_WIDTH) / intervalGap) * 1000;

            canvases.push(
                <TimelineCanvas
                    key={timeInterval + "_" + i}
                    startTime={startTime}
                    maxTime={duration * 1000}
                    width={
                        i !== numOfCanvases - 1
                            ? CANVAS_WIDTH
                            : pxRequired % CANVAS_WIDTH
                    }
                />
            );
        }

        return canvases;
    };

    return (
        elem &&
        createPortal(
            <>
                <VideoTimeline />
                <div
                    style={{ width: `${1920 - SECTION_HEADER_WIDTH}px` }}
                    className="h-full bg-black"
                />
            </>,
            elem
        )
    );
};

const TimelineCanvas: React.FC<{
    startTime: number;
    maxTime: number;
    width: number;
}> = ({ startTime, maxTime, width }) => {
    const {
        settings: { timeInterval, intervalGap },
    } = useContext(SettingsContext);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            throw new Error("dev error");
        }

        const ctx2d = canvas.getContext("2d");
        if (!ctx2d) {
            throw new Error("dev error");
        }

        const space = intervalGap / 10;
        ctx2d.clearRect(0, 0, canvas.width, canvas.height);
        ctx2d.font = "10px Roboto";

        let t = startTime;
        for (let i = 0; i < width; i += intervalGap) {
            ctx2d.beginPath();
            ctx2d.moveTo(i, 0);
            ctx2d.lineTo(i, TIMELINE_HEIGHT);
            ctx2d.stroke();
            ctx2d.closePath();
            for (let j = i + space; j < i + intervalGap; j += space) {
                ctx2d.beginPath();
                ctx2d.moveTo(j, 0);
                ctx2d.lineTo(j, 10);
                ctx2d.stroke();
                ctx2d.closePath();
            }
            ctx2d.fillText(toHHMMSSMS(t), i + 4, TIMELINE_HEIGHT - 4);
            t += timeInterval;
            if (t > maxTime) {
                break;
            }
        }
    }, [timeInterval]);

    const seekToVideo = (e: MouseEvent<HTMLCanvasElement>) => {
        const video = document.getElementById(VIDEO_ID) as HTMLVideoElement;

        if (!video) {
            return;
        }

        const { left } = (e.target as HTMLDivElement).getBoundingClientRect();
        const xPos =
            SECTION_HEADER_WIDTH - left + (e.clientX - SECTION_HEADER_WIDTH);
        const sRatio = timeInterval / intervalGap;
        const time = (xPos * sRatio) / 1000;

        video.currentTime = time;
    };

    return (
        <canvas
            onClick={seekToVideo}
            className="shrink-0"
            style={{
                width: `${width}px`,
                height: `${TIMELINE_HEIGHT}px`,
            }}
            width={width}
            height={TIMELINE_HEIGHT}
            ref={canvasRef}
        />
    );
};
