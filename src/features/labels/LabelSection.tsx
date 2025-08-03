import { CANVAS_WIDTH } from "@/constants/settings";
import { useMenu } from "@/hooks/useMenu";
import { SettingsContext } from "@/stores/settings";
import { guidGenerator } from "@/utils/id";
import { MouseEvent, useContext, useState } from "react";
import { SectionHeader } from "./components/SectionHeader";
import { Strip } from "./components/Strip";
import { LABEL_HEIGHT } from "./constants/label";
import { Label, Section } from "./interfaces/dataset";
import { labelsByTiers } from "./utils/labels";

export const LabelSection: React.FC<
    Section & {
        zIndex: number;
        updateSection: (id: string, title: string, color: string) => void;
        deleteSection: (id: string) => void;
    }
> = ({ updateSection, deleteSection, zIndex, ...section }) => {
    const {
        settings: { intervalGap, timeInterval },
    } = useContext(SettingsContext);
    const { menu, onContextMenu, ContextMenu, closeMenu } = useMenu();
    const [labels, setLabels] = useState<Label[]>(section.labels);

    const addNewLabel = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (menu) {
            const xPos =
                CANVAS_WIDTH - menu.left + (menu.clientX - CANVAS_WIDTH);
            const sRatio = timeInterval / intervalGap;
            const startTime = xPos * sRatio;
            const newLabel = {
                id: guidGenerator(),
                text: "Untitled label",
                startTime,
                endTime: startTime + 1000,
            };
            setLabels((prev) => prev.concat([newLabel]));
            closeMenu();
        }
    };

    const editLabel = (newLabel: Label) => {
        setLabels((prev) =>
            prev.map((label) => (label.id === newLabel.id ? newLabel : label))
        );
    };

    const tiered = labelsByTiers(labels);

    return (
        <div
            style={{ zIndex }}
            className="w-full bg-white min-h-12 border-b border-gray-300 flex"
        >
            <SectionHeader
                id={section.id}
                color={section.color}
                title={section.title}
                updateSection={updateSection}
                deleteSection={deleteSection}
            />
            <div
                onContextMenu={onContextMenu}
                style={{
                    background: `${section.color}1a`,
                    height: `${12 + tiered.length * (LABEL_HEIGHT + 4)}px`,
                }}
                className="w-full relative min-h-12"
            >
                {tiered.map((tierLabels, i) =>
                    tierLabels.map((label) => (
                        <Strip
                            key={label.id}
                            top={i}
                            label={label}
                            section={{
                                id: section.id,
                                color: section.color,
                            }}
                            editLabel={editLabel}
                        />
                    ))
                )}
            </div>
            {
                <ContextMenu>
                    <div
                        data-menu="ctx-add-new"
                        onClick={addNewLabel}
                        className="hover:bg-gray-200 w-full px-4 py-1.5 cursor-pointer"
                    >
                        Add new label
                    </div>
                </ContextMenu>
            }
        </div>
    );
};
