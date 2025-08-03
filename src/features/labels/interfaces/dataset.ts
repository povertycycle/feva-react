export interface Label {
    id: string;
    startTime: number;
    endTime: number;
    text: string;
}

export interface Section {
    id: string;
    title: string;
    color: string;
    labels: Label[];
}

export interface Dataset {
    sections: Section[];
}

export interface ContextData {
    clientX: number;
    clientY: number;
    left: number;
}
