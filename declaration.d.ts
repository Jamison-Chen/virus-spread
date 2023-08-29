declare class Chart {
    constructor(ctx: HTMLCanvasElement, config: Object);
    update: () => void;
    destroy: () => void;
    data: {
        labels: (string | number)[];
        datasets: { data: number[] }[];
    };
}
