import { Label, Section } from "../interfaces/dataset";

export function labelsByTiers(labels: Label[]): Label[][] {
    const tiers: Label[][] = [];

    labels.forEach((label) => {
        let added = false;
        for (let i = 0; i < tiers.length; i++) {
            const currentLabels = tiers[i];
            const touchesTier = currentLabels.some((l) =>
                isOverlapping(l, label)
            );
            if (!touchesTier) {
                added = true;
                tiers[i].push(label);
                break;
            }
        }
        if (!added) {
            tiers[tiers.length] = [label];
        }
    });

    return tiers;
}

function isOverlapping(labelA: Label, labelB: Label) {
    return (
        (labelB.startTime <= labelA.startTime &&
            labelA.startTime <= labelB.endTime) ||
        (labelB.startTime <= labelA.endTime && labelA.endTime <= labelB.endTime)
    );
}

export function processFilterMap(
    section: Pick<Section, "id" | "color" | "title">[]
) {
    return section.reduce((acc, curr) => ({ ...acc, [curr.id]: true }), {});
}

export function checkHasChanges(changes: Label, original: Label) {
    return Object.entries(changes).some(
        ([key, value]) => original[key as keyof Label] !== value
    );
}
