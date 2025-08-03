/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DEFAULT_SETTINGS } from "@/constants/settings";
import { Settings } from "@/interfaces/settings";
import { createContext } from "react";

/**
 * Settings values inside the context store; to be propagated to all children
 * and will re-render all child components it wraps.
 */
interface SettingsContextProps {
    settings: Settings;
    setSettings: (newSettings: Settings) => void;
}

export const SettingsContext = createContext<SettingsContextProps>({
    settings: DEFAULT_SETTINGS,
    setSettings: (newSettings) => {},
});
