import { Toast, ToastData, ToastType } from "@/components/Toast";
import { useState } from "react";

/**
 * [v2.0] - Hook to call toast messages.
 * - Default duration is 5 seconds if not provided.
 */
export const useToast = (duration?: number) => {
    const [content, setContent] = useState<ToastData | null>(null);

    /**
     * Toast message sender.
     * @param message Message string.
     * @param type "normal" | "error" | "info"
     */
    const toast = (message: string, type?: ToastType) => {
        setContent({
            message,
            type: type ?? "info",
        });
    };

    // Remove at the end of toast message.
    const remove = () => {
        setContent(null);
    };

    return {
        toast,
        Toast: !!content && (
            <Toast data={content} duration={duration} remove={remove} />
        ),
    };
};
