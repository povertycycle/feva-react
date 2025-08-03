import { Settings } from "@/interfaces/settings";

export function checkHasChanges(payload: Settings, defaultValue: Settings) {
    return Object.entries(payload).some(
        ([key, value]) => defaultValue[key as keyof Settings] !== value
    );
}
