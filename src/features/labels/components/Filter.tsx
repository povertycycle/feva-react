/* eslint-disable react-hooks/exhaustive-deps */
import { FILTER_CONTAINER } from "@/constants/portals";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Section } from "../interfaces/dataset";
import { processFilterMap } from "../utils/labels";
import { FilterSection } from "./ui/FilterSection";
import { FilterText } from "./ui/FilterText";

interface FilterProps {
    sections: Pick<Section, "id" | "color" | "title">[];
}

interface FilterData {
    text: string;
    sections: Record<string, boolean>;
}

export const Filter: React.FC<FilterProps> = ({ sections }) => {
    const [elem, setElem] = useState<HTMLElement | null>();
    const [filter, setFilter] = useState<FilterData>({
        text: "",
        sections: processFilterMap(sections),
    });

    useEffect(() => {
        if (elem === undefined) {
            setElem(document.getElementById(FILTER_CONTAINER) ?? null);
        }
    }, []);

    function filterLabels() {
        document.querySelectorAll("[data-label-text]").forEach((elem) => {
            let display = "flex";
            const labelText = elem.getAttribute("data-label-text");
            const labelSection = elem.getAttribute("data-label-section");

            if (
                !labelText?.includes(filter.text) ||
                (labelSection && !filter.sections[labelSection])
            ) {
                display = "none";
            }
            (elem as HTMLDivElement).style.display = display;
        });
    }

    const filterByText = (text: string) => {
        setFilter((prev) => ({ ...prev, text }));
    };

    const filterBySection = (sectionId: string, value: boolean) => {
        setFilter((prev) => ({
            ...prev,
            sections: { ...prev.sections, [sectionId]: value },
        }));
    };

    useEffect(() => {
        filterLabels();
    }, [filter]);

    useEffect(() => {
        setFilter((prev) => ({
            ...prev,
            sections: {
                ...processFilterMap(sections),
                ...prev.sections,
            },
        }));
    }, [sections]);

    return (
        elem &&
        createPortal(
            <div className="w-full h-12 bg-white border-y border-gray-300 p-2 flex items-center gap-2">
                <FilterText filterByText={filterByText} />
                <FilterSection
                    values={filter.sections}
                    sections={sections}
                    filterBySection={filterBySection}
                />
            </div>,
            elem
        )
    );
};
