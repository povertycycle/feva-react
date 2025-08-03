/* eslint-disable @next/next/no-img-element */
import { TOOLBAR_LABEL_MENU } from "@/constants/portals";
import { useState } from "react";
import { SettingsMenu } from "./SettingsMenu";

/**
 * Toolbar
 */
export const Toolbar: React.FC = () => {
    const [compressed, setCompressed] = useState<boolean>(false);

    return (
        <div className="w-full relative">
            <div
                style={{ transition: "height 200ms" }}
                className={`${
                    compressed ? "h-0 overflow-hidden" : "h-12"
                }  flex bg-white z-50 relative`}
            >
                <div className="w-full h-full flex">
                    <img alt="" src="images/feva.png" className="h-full" />
                    <div className="flex gap-2 w-full pl-3">
                        <div id={TOOLBAR_LABEL_MENU} className="flex gap-2" />
                        <SettingsMenu />
                    </div>
                </div>
            </div>
            <button
                onClick={() => setCompressed((prev) => !prev)}
                className={`cursor-pointer absolute z-50 right-4 -translate-y-0.5 bg-gray-100 w-8 h-8 rounded-b-sm`}
            >
                <div
                    className={`${
                        compressed ? "rotate-0" : "rotate-180"
                    } transition-transform`}
                >
                    <i className="ri-arrow-down-s-line" />
                </div>
            </button>
        </div>
    );
};
