export default class LineChart {
    public static ctx = document.getElementById(
        "my-chart"
    ) as HTMLCanvasElement;
    public chart;
    public constructor() {
        this.chart = new Chart(LineChart.ctx, {
            type: "line",
            data: {
                labels: [],
                datasets: [
                    {
                        label: "Current Infection",
                        borderColor: "rgba(99, 255, 132, 1)",
                        data: [],
                    },
                    {
                        label: "Cumulative Infection",
                        borderColor: "rgba(99, 132, 255, 1)",
                        data: [],
                    },
                ],
            },
            options: {
                legend: {
                    labels: {
                        fontSize: 10,
                        boxWidth: 3,
                    },
                },
            },
        });
    }
}
