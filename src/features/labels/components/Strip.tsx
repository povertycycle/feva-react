import { LABEL_LIST_CONTAINER } from "@/constants/portals";
import { createPortal } from "react-dom";
import { Label, Section } from "../interfaces/dataset";
import { ListDisplay } from "./ui/ListDisplay";
import { StripDisplay } from "./ui/StripDisplay";

interface StripProps {
    label: Label;
    top: number;
    section: Pick<Section, "id" | "color">;
    editLabel: (label: Label) => void;
}

export const Strip: React.FC<StripProps> = ({
    label,
    top,
    section,
    editLabel,
}) => {
    const elem = document.getElementById(LABEL_LIST_CONTAINER);
    const updateLabel = (label: Label) => {
        editLabel(label);
    };

    return (
        <>
            <StripDisplay
                color={section.color}
                label={label}
                top={top}
                updateLabel={updateLabel}
            />
            {elem &&
                createPortal(
                    <ListDisplay
                        updateLabel={updateLabel}
                        section={section}
                        label={label}
                    />,
                    elem
                )}
        </>
    );
};
