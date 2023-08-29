import LineChart from "./chart.js";
import Dot from "./dot.js";

export class Data {
    public static mode: "classic" | "center" | null = null;
    public static goToCenterRate: number = 25;
    public static population: number = 100;
    public static energy: number = 5;
    public static initialInfectedRate: number = 2;
    public static virusPower: number = 0.1;
    public static effectiveRange: number = 20;
    public static recoverDay: number = 5;
    public static status: "stopped" | "running" | "paused" = "stopped";
    public static dots: Dot[] = [];
    public static day: number = 0;
}

class Main {
    private static selectModePageDiv: HTMLElement =
        document.getElementById("select-mode-page")!;
    private static settingTriggerDiv: HTMLElement =
        document.getElementById("setting-trigger")!;
    private static modeDivs = document.getElementsByClassName("mode");
    private static goToCenterRateInput = document.getElementById(
        "go-to-center-rate-input"
    ) as HTMLInputElement;
    private static goToCenterRateOutput = document.getElementById(
        "go-to-center-rate-output"
    ) as HTMLOutputElement;
    private static populationInput = document.getElementById(
        "population-input"
    ) as HTMLInputElement;
    private static populationOutput = document.getElementById(
        "population-output"
    ) as HTMLOutputElement;
    private static energyInput = document.getElementById(
        "energy-input"
    ) as HTMLInputElement;
    private static energyOutput = document.getElementById(
        "energy-output"
    ) as HTMLOutputElement;
    private static initialInfectedRateInput = document.getElementById(
        "initial-infected-rate-input"
    ) as HTMLInputElement;
    private static initialInfectedRateOutput = document.getElementById(
        "initial-infected-rate-output"
    ) as HTMLOutputElement;
    private static virusPowerInput = document.getElementById(
        "virus-power-input"
    ) as HTMLInputElement;
    private static virusPowerOutput = document.getElementById(
        "virus-power-output"
    ) as HTMLOutputElement;
    private static effectiveRangeInput = document.getElementById(
        "effective-range-input"
    ) as HTMLInputElement;
    private static effectiveRangeOutput = document.getElementById(
        "effective-range-output"
    ) as HTMLOutputElement;
    private static recoverDayInput = document.getElementById(
        "recover-day-input"
    ) as HTMLInputElement;
    private static recoverDayOutput = document.getElementById(
        "recover-day-output"
    ) as HTMLOutputElement;
    private static startButton: HTMLElement =
        document.getElementById("start-button")!;
    private static stopButton: HTMLElement =
        document.getElementById("stop-button")!;
    private static mainDiv: HTMLElement = document.getElementById("main")!;
    private static centerDiv?: HTMLDivElement;
    private static lineChart?: LineChart;
    private static updateChartInterval: number;
    public static main(): void {
        // Prepare select mode page
        for (let modeDiv of Main.modeDivs) {
            const modeNameDiv = modeDiv.firstElementChild as HTMLElement;
            modeNameDiv.addEventListener("click", () => {
                Data.mode = modeNameDiv.innerText as "classic" | "center";
                for (let anotherDiv of Main.modeDivs) {
                    if (!Object.is(modeDiv, anotherDiv)) {
                        anotherDiv.classList.remove("active");
                    } else anotherDiv.classList.add("active");
                }
                if (Data.mode === "center") Main.initCenter();
                else Main.centerDiv?.remove();
                Main.settingTriggerDiv.classList.replace("hide", "show");
            });
        }
        Main.settingTriggerDiv.classList.add("close", "hide");
        Main.settingTriggerDiv.addEventListener(
            "click",
            Main.closeSelectModePage,
            { once: true }
        );
        Main.goToCenterRateInput.min = "0";
        Main.goToCenterRateInput.max = "100";
        Main.goToCenterRateInput.step = "5";
        Main.goToCenterRateInput.value = `${Data.goToCenterRate}`;
        Main.goToCenterRateOutput.value = `${Data.goToCenterRate}%`;
        Main.goToCenterRateInput.addEventListener("input", () => {
            Data.goToCenterRate = parseInt(Main.goToCenterRateInput.value);
            Main.goToCenterRateOutput.value = `${Data.goToCenterRate}%`;
        });

        // Prepare side bar
        //// Population
        Main.populationInput.min = "1";
        Main.populationInput.max = "500";
        Main.populationInput.step = "5";
        Main.populationInput.value = `${Data.population}`;
        Main.populationOutput.value = `${Data.population}`;
        Main.populationInput.addEventListener("input", () => {
            Data.population = parseInt(Main.populationInput.value);
            Main.populationOutput.value = `${Data.population}`;
        });

        //// Energy
        Main.energyInput.min = "0";
        Main.energyInput.max = "10";
        Main.energyInput.step = "1";
        Main.energyInput.value = `${Data.energy}`;
        Main.energyOutput.value = `${Data.energy}`;
        Main.energyInput.addEventListener("input", () => {
            Data.energy = parseInt(Main.energyInput.value);
            Main.energyOutput.value = `${Data.energy}`;
        });

        //// Initial Infected Rate
        Main.initialInfectedRateInput.min = "0";
        Main.initialInfectedRateInput.max = "100";
        Main.initialInfectedRateInput.step = "1";
        Main.initialInfectedRateInput.value = `${Data.initialInfectedRate}`;
        Main.initialInfectedRateOutput.value = `${Data.initialInfectedRate}`;
        Main.initialInfectedRateInput.addEventListener("input", () => {
            Data.initialInfectedRate = parseInt(
                Main.initialInfectedRateInput.value
            );
            Main.initialInfectedRateOutput.value = `${Data.initialInfectedRate}`;
        });

        //// Virus Power
        Main.virusPowerInput.min = "0.01";
        Main.virusPowerInput.max = "1";
        Main.virusPowerInput.step = "0.01";
        Main.virusPowerInput.value = `${Data.virusPower}`;
        Main.virusPowerOutput.value = `${Data.virusPower}`;
        Main.virusPowerInput.addEventListener("input", () => {
            Data.virusPower = parseFloat(Main.virusPowerInput.value);
            Main.virusPowerOutput.value = `${Data.virusPower}`;
        });

        //// Virus Effective Range
        Main.effectiveRangeInput.min = "10";
        Main.effectiveRangeInput.max = "40";
        Main.effectiveRangeInput.step = "1";
        Main.effectiveRangeInput.value = `${Data.effectiveRange}`;
        Main.effectiveRangeOutput.value = `${Data.effectiveRange}`;
        Main.effectiveRangeInput.addEventListener("input", () => {
            Data.effectiveRange = parseInt(Main.effectiveRangeInput.value);
            Main.effectiveRangeOutput.value = `${Data.effectiveRange}`;
        });

        //// Recover Day
        Main.recoverDayInput.min = "1";
        Main.recoverDayInput.max = "7";
        Main.recoverDayInput.step = "1";
        Main.recoverDayInput.value = `${Data.recoverDay}`;
        Main.recoverDayOutput.value = `${Data.recoverDay}`;
        Main.recoverDayInput.addEventListener("input", () => {
            Data.recoverDay = parseInt(Main.recoverDayInput.value);
            Main.recoverDayOutput.value = `${Data.recoverDay}`;
        });

        //// Start Button
        Main.startButton.classList.add("start");
        Main.startButton.addEventListener("click", Main.start, { once: true });

        //// Stop Button
        Main.stopButton.classList.add("disabled");
    }
    private static openSelectModePage = (): void => {
        Main.selectModePageDiv.classList.remove("hide");
        Main.settingTriggerDiv.classList.remove("open");
        Main.settingTriggerDiv.classList.add("close");
        if (Data.mode) Main.settingTriggerDiv.classList.add("show");
        else Main.settingTriggerDiv.classList.add("hide");
        Main.settingTriggerDiv.addEventListener(
            "click",
            Main.closeSelectModePage,
            { once: true }
        );
    };
    private static closeSelectModePage = (): void => {
        Main.selectModePageDiv.classList.add("hide");
        Main.settingTriggerDiv.classList.replace("close", "open");
        Main.settingTriggerDiv.classList.remove("show", "hide");
        Main.settingTriggerDiv.addEventListener(
            "click",
            Main.openSelectModePage,
            { once: true }
        );
    };
    private static initCenter(): void {
        Main.centerDiv = document.createElement("div");
        Main.centerDiv.id = "center";
        Main.mainDiv.appendChild(Main.centerDiv);
    }
    private static start = (): void => {
        Main.startButton.classList.replace("start", "pause");

        // Disable all setting controllers
        Main.populationInput.disabled = true;
        Main.energyInput.disabled = true;
        Main.initialInfectedRateInput.disabled = true;
        Main.virusPowerInput.disabled = true;
        Main.effectiveRangeInput.disabled = true;
        Main.recoverDayInput.disabled = true;

        if (Data.status === "stopped") {
            // Init all dots
            for (let i = 0; i < Data.population; i++) {
                let dot: Dot;
                if (i < (Data.initialInfectedRate / 100) * Data.population) {
                    dot = new Dot(Data.energy, Data.recoverDay);
                    dot.getInfected();
                } else {
                    dot = new Dot(Data.energy, Data.recoverDay);
                }
                Data.dots.push(dot);
                dot.isRecorded = true;
            }

            // Enable the stop button
            Main.stopButton.addEventListener("click", Main.stop, {
                once: true,
            });
            Main.stopButton.classList.remove("disabled");
            this.lineChart = new LineChart();
        } else if (Data.status === "paused") {
            // ...
        } else throw Error("The simulation has already been running.");
        Data.status = "running";
        Main.run();
        Main.startButton.addEventListener("click", Main.pause, { once: true });
        Main.updateChartInterval = setInterval(() => {
            Data.day++;
            this.lineChart?.chart.data.labels.push(Data.day);
            this.lineChart?.chart.data.datasets[0].data.push(
                Data.dots.filter((dot) => dot.status === "infected").length /
                    Data.population
            );
            this.lineChart?.chart.data.datasets[1].data.push(
                Data.dots.filter((dot) => dot.status !== "healthy").length /
                    Data.population
            );
            this.lineChart?.chart.update();
        }, 1000);
    };
    private static pause = (): void => {
        Main.startButton.classList.replace("pause", "start");
        Data.status = "paused";
        Main.startButton.addEventListener("click", Main.start, { once: true });
        clearInterval(Main.updateChartInterval);
    };
    private static stop = (): void => {
        Data.status = "stopped";
        Main.startButton.classList.remove("pause");
        Main.startButton.classList.add("start");
        Main.startButton.removeEventListener("click", Main.pause);
        Main.startButton.removeEventListener("click", Main.start);
        Main.startButton.addEventListener("click", Main.start, { once: true });

        // Clear all dots
        Data.dots.forEach((dot) => dot.div.remove());
        Data.dots = [];

        // Clear Data
        clearInterval(Main.updateChartInterval);
        Data.day = 0;
        Main.lineChart?.chart.destroy();

        // Enable all setting controllers
        Main.populationInput.disabled = false;
        Main.energyInput.disabled = false;
        Main.initialInfectedRateInput.disabled = false;
        Main.virusPowerInput.disabled = false;
        Main.effectiveRangeInput.disabled = false;
        Main.recoverDayInput.disabled = false;

        Main.stopButton.removeEventListener("click", Main.stop);
        Main.stopButton.classList.add("disabled");
    };
    private static run(): void {
        // if (Data.dots.every((dot) => dot.status !== "infected")) Main.pause();
        Data.dots.forEach((dot) => {
            dot.move();
            Main.checkHealthStatus(dot);
        });
        if (Data.status === "running") requestAnimationFrame(Main.run);
    }
    private static checkHealthStatus(dot: Dot): void {
        if (dot.status === "healthy") {
            for (const anotherDot of Data.dots) {
                if (
                    !Object.is(dot, anotherDot) &&
                    anotherDot.status === "infected"
                ) {
                    const distance = Math.sqrt(
                        Math.pow(dot.position[0] - anotherDot.position[0], 2) +
                            Math.pow(
                                dot.position[1] - anotherDot.position[1],
                                2
                            )
                    );
                    const p =
                        (Data.virusPower * (Data.effectiveRange - distance)) /
                        Data.effectiveRange;
                    if (Math.random() < p) dot.getInfected();
                }
            }
        }
    }
}

Main.main();
