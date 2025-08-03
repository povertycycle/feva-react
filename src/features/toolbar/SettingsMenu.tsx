/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dropdown } from "@/components/Dropdown";
import { Settings } from "@/interfaces/settings";
import { SettingsContext } from "@/stores/settings";
import { useContext, useState } from "react";
import { InputInterval } from "./components/InputInterval";
import { checkHasChanges } from "./utils/settings";

export const SettingsMenu: React.FC = () => {
    const { settings: defaultSettings, setSettings: updateSettings } =
        useContext(SettingsContext);
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const hasChanges = checkHasChanges(settings, defaultSettings);

    const handleChange = (key: string) => {
        return (value: any) =>
            setSettings((prev) => ({
                ...prev,
                [key]: value,
            }));
    };

    const update = () => {
        updateSettings(settings);
    };

    return (
        <Dropdown>
            <Dropdown.Toggle className="text-lg px-4 hover:bg-gray-200 cursor-pointer">
                <i className="ri-settings-5-line text-xl" /> Settings
            </Dropdown.Toggle>
            <Dropdown.Menu className="font-medium text-lg">
                <div className="flex flex-col py-2 w-96 px-4">
                    <div className="flex items-center py-4 gap-2">
                        <InputInterval
                            value={settings.timeInterval}
                            onChange={handleChange("timeInterval")}
                        >
                            ms
                        </InputInterval>
                        <span>/</span>
                        <InputInterval
                            value={settings.intervalGap}
                            onChange={handleChange("intervalGap")}
                        >
                            pixels
                        </InputInterval>
                    </div>
                </div>
                <button
                    disabled={!hasChanges}
                    onClick={hasChanges ? update : undefined}
                    className="not-disabled:hover:bg-gray-100 disabled:text-gray-300 px-8 py-3 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
                >
                    Apply changes
                </button>
            </Dropdown.Menu>
        </Dropdown>
    );
};
