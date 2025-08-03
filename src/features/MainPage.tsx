import { DEFAULT_SETTINGS, SECTION_HEADER_WIDTH } from "@/constants/settings";
import { Settings } from "@/interfaces/settings";
import { SettingsContext } from "@/stores/settings";
import { useState } from "react";
import { LabelList } from "./labels/LabelList";
import { LabelTimeline } from "./labels/LabelTimeline";
import { Toolbar } from "./toolbar/Toolbar";
import { VideoDisplay } from "./video/VideoDisplay";

/**
 * Root main page SPA
 */
export const MainPage: React.FC = () => {
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

    const updateSettings = (newSettings: Settings) => {
        setSettings(newSettings);
    };

    return (
        <SettingsContext.Provider
            value={{ settings, setSettings: updateSettings }}
        >
            <div className="w-full h-full flex flex-col">
                <Toolbar />
                <div className="w-full h-full flex flex-col">
                    <div className="w-full h-1/2 flex">
                        <LabelList />
                        <VideoDisplay />
                    </div>
                    <div className="h-1/2 w-full border-t border-gray-300 flex flex-col">
                        <LabelTimeline />
                        <div
                            className="fixed w-px bg-black min-h-[414px]"
                            style={{ left: `${SECTION_HEADER_WIDTH}px` }}
                        >
                            <i className="ri-arrow-down-s-fill text-5xl absolute -translate-y-[18px] -translate-x-1/2 text-black" />
                            <i className="ri-arrow-up-s-fill text-5xl absolute bottom-0 translate-y-[18px] -translate-x-1/2 text-black" />
                        </div>
                    </div>
                </div>
            </div>
        </SettingsContext.Provider>
    );
};
