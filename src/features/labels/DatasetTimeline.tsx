import { guidGenerator } from "@/utils/id";
import { useState } from "react";
import { AddNewSection } from "./AddNewSection";
import { DatasetMenu } from "./components/DatasetMenu";
import { Filter } from "./components/Filter";
import { Dataset } from "./interfaces/dataset";
import { LabelSection } from "./LabelSection";

export const DatasetTimeline: React.FC = () => {
    const [dataset, setDataset] = useState<Dataset>({ sections: [] });

    const updateDataset = (newDataset: Dataset) => {
        setDataset(newDataset);
    };

    const addSection = (title: string, color: string) => {
        setDataset({
            sections: dataset.sections.concat({
                id: guidGenerator(),
                title,
                color,
                labels: [],
            }),
        });
    };

    const updateSection = (id: string, title: string, color: string) => {
        setDataset({
            sections: dataset.sections.map((section) =>
                section.id === id ? { ...section, title, color } : section
            ),
        });
    };

    const deleteSection = (id: string) => {
        setDataset({
            sections: dataset.sections.filter((section) => section.id !== id),
        });
    };

    return (
        <>
            <div className="flex flex-col w-full grow">
                {dataset.sections.map((section, i) => (
                    <LabelSection
                        zIndex={dataset.sections.length - i}
                        key={section.id}
                        {...section}
                        updateSection={updateSection}
                        deleteSection={deleteSection}
                    />
                ))}
                <AddNewSection addSection={addSection} />
            </div>
            <DatasetMenu updateDataset={updateDataset} />
            <Filter
                sections={dataset.sections.map((section) => ({
                    id: section.id,
                    color: section.color,
                    title: section.title,
                }))}
            />
        </>
    );
};
