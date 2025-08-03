import { FILTER_CONTAINER, LABEL_LIST_CONTAINER } from "@/constants/portals";

export const LabelList: React.FC = () => {
    return (
        <div className="h-full max-w-[400px] bg-gray-100 w-full flex flex-col">
            <div id={FILTER_CONTAINER} className="w-full" />
            <div
                id={LABEL_LIST_CONTAINER}
                className="h-0 w-full overflow-y-scroll grow"
            />
        </div>
    );
};
