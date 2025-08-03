import { Dropdown } from "@/components/Dropdown";
import { ChangeEvent } from "react";
import { Section } from "../../interfaces/dataset";

interface FilterSectionProps {
    values: Record<string, boolean>;
    sections: Pick<Section, "id" | "color" | "title">[];
    filterBySection: (sectionId: string, value: boolean) => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
    values,
    sections,
    filterBySection,
}) => {
    const onToggle = (id: string) => (e: ChangeEvent<HTMLInputElement>) =>
        filterBySection(id, e.target.checked);

    return (
        <Dropdown>
            <Dropdown.Toggle className="h-7 flex aspect-square border border-gray-300 hover:bg-gray-100 cursor-pointer rounded-sm">
                <i className="ri-filter-3-line m-auto" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {sections.map((section) => {
                    const isActive = !!values[section.id];
                    return (
                        <div
                            key={section.id}
                            className="flex whitespace-nowrap items-center w-64 gap-3 p-1"
                        >
                            <div
                                className="h-6 aspect-square shrink-0 flex"
                                style={{
                                    background: isActive ? section.color : "",
                                    border: `1px solid ${section.color}`,
                                }}
                            >
                                <i className="ri-check-line m-auto text-lg/4 text-white" />
                            </div>
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={onToggle(section.id)}
                                className="opacity-0 absolute w-6 h-6"
                            />
                            <label className="w-0 grow flex pr-2">
                                <span className="truncate">
                                    {section.title}
                                </span>
                            </label>
                        </div>
                    );
                })}
            </Dropdown.Menu>
        </Dropdown>
    );
};
