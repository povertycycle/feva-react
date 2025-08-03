/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { TOOLBAR_LABEL_MENU } from "@/constants/portals";
import { useToast } from "@/hooks/useToast";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Dataset } from "../interfaces/dataset";
import { parseJsonFile } from "@/utils/file";
import { Dropdown } from "@/components/Dropdown";

interface DatasetMenuProps {
    updateDataset: (dataset: Dataset) => void;
}

export const DatasetMenu: React.FC<DatasetMenuProps> = ({ updateDataset }) => {
    const { toast, Toast } = useToast();
    const [toolbar, setToolbar] = useState<HTMLElement | null>();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (toolbar === undefined) {
            setToolbar(document.getElementById(TOOLBAR_LABEL_MENU) ?? null);
        }
    }, []);

    const handleSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file || !file.type.endsWith("json")) {
            toast("Wrong dataset type", "error");
            return;
        }

        parseJsonFile(file)
            .then((res: any) => {
                if ("sections" in res) {
                    updateDataset(res as Dataset);
                } else {
                    throw new Error("Dataset not of the correct type");
                }
            })
            .catch((err) => {
                toast(err, "error");
            });
    };

    return (
        <>
            {toolbar &&
                createPortal(
                    <>
                        <Dropdown>
                            <Dropdown.Toggle className="text-lg px-4 hover:bg-gray-200 cursor-pointer">
                                <i className="ri-archive-stack-line text-xl" />{" "}
                                Datasets
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="w-64">
                                <button
                                    onClick={() => inputRef.current?.click()}
                                    className="whitespace-nowrap flex gap-2 px-4 py-2 text-lg items-center bg-white hover:bg-gray-100 cursor-pointer justify-start"
                                >
                                    <i className="ri-folder-fill text-xl" />
                                    <span className="font-medium">
                                        Load Dataset
                                    </span>
                                </button>
                                <input
                                    className="hidden absolute"
                                    ref={inputRef}
                                    type="file"
                                    accept="application/json"
                                    onChange={handleSelectFile}
                                />
                                <button className="whitespace-nowrap flex gap-2 px-4 py-2 text-lg items-center bg-white hover:bg-gray-100 cursor-pointer justify-start">
                                    <i className="ri-save-fill text-xl" />
                                    <span className="font-medium">
                                        Save Dataset
                                    </span>
                                </button>
                            </Dropdown.Menu>
                        </Dropdown>
                    </>,
                    toolbar
                )}
            {Toast}
        </>
    );
};
