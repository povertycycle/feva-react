import { useEffect, useRef } from "react";
import styles from "./toast.module.scss";

/**
 * [v2.0] - Toast display type.
 * - `normal` is set to green.
 * - `error` is set to red.
 * - `info` is set to blue.
 */
export type ToastType = "success" | "error" | "info";

/**
 * [v2.0] - Toast data object containing toast message and toast type.
 */
export interface ToastData {
    message: string;
    type?: ToastType;
}

interface ToastProps {
    data: ToastData;
    duration?: number;
    remove: () => void;
}

/**
 * [v2.0] - Message toast component used to display information at the top of the screen.
 * @param data Toast data to be displayed, contains message and if the type is an error type.
 * @param duration Duration of the message before going out in milliseconds. Default is 3s.
 * @param remove Remove toast functionality.
 */
export const Toast: React.FC<ToastProps> = ({ data, duration, remove }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { remixicon, color } = (() => {
        switch (data?.type) {
            case "success":
                return {
                    remixicon: "ri-checkbox-circle-fill",
                    color: "bg-green-success",
                };
            case "error":
                return { remixicon: "ri-alert-fill", color: "bg-red-error" };
            default:
            case "info":
                return {
                    remixicon: "ri-information-fill",
                    color: "bg-blue-info",
                };
        }
    })();

    // Display toast and remove at the end of message.
    useEffect(() => {
        let followUpId: NodeJS.Timeout;
        const timeoutId = setTimeout(() => {
            if (ref.current) ref.current.style.transform = "translateY(-150%)";
            followUpId = setTimeout(() => {
                remove();
            }, 300);
        }, duration ?? 5000);

        return () => {
            window.clearTimeout(timeoutId);
            window.clearTimeout(followUpId);
        };
    }, []);

    return (
        <div
            ref={ref}
            className={`${styles.toast} text-base/5 xs:text-base/6 translate-y-4 -translate-x-1/2 overflow-hidden transition-transform fixed top-0 left-1/2 max-xs:w-full text-white font-medium px-2 z-[100]`}
        >
            <div
                className={`max-w-[480px] flex items-center justify-center gap-2 px-4 py-2 w-fit mx-auto ${color} rounded-md`}
            >
                <i className={`${remixicon} text-xl/8`} />
                <span className="ml-2">{data.message}</span>
                <div className="bg-white/25 h-7 w-0.5 mx-2" />
                <button onClick={remove}>
                    <i className="ri-close-line text-lg/6" />
                </button>
            </div>
        </div>
    );
};
