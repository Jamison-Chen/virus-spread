import LineChart from "./chart.js";
import Dot from "./dot.js";
export class Data {
    static mode = null;
    static goToCenterRate = 25;
    static population = 100;
    static energy = 5;
    static initialInfectedRate = 2;
    static virusPower = 0.1;
    static effectiveRange = 20;
    static recoverDay = 5;
    static status = "stopped";
    static dots = [];
    static day = 0;
}
class Main {
    static selectModePageDiv = document.getElementById("select-mode-page");
    static settingTriggerDiv = document.getElementById("setting-trigger");
    static modeDivs = document.getElementsByClassName("mode");
    static goToCenterRateInput = document.getElementById("go-to-center-rate-input");
    static goToCenterRateOutput = document.getElementById("go-to-center-rate-output");
    static populationInput = document.getElementById("population-input");
    static populationOutput = document.getElementById("population-output");
    static energyInput = document.getElementById("energy-input");
    static energyOutput = document.getElementById("energy-output");
    static initialInfectedRateInput = document.getElementById("initial-infected-rate-input");
    static initialInfectedRateOutput = document.getElementById("initial-infected-rate-output");
    static virusPowerInput = document.getElementById("virus-power-input");
    static virusPowerOutput = document.getElementById("virus-power-output");
    static effectiveRangeInput = document.getElementById("effective-range-input");
    static effectiveRangeOutput = document.getElementById("effective-range-output");
    static recoverDayInput = document.getElementById("recover-day-input");
    static recoverDayOutput = document.getElementById("recover-day-output");
    static startButton = document.getElementById("start-button");
    static stopButton = document.getElementById("stop-button");
    static mainDiv = document.getElementById("main");
    static centerDiv;
    static lineChart;
    static updateChartInterval;
    static main() {
        for (let modeDiv of Main.modeDivs) {
            const modeNameDiv = modeDiv.firstElementChild;
            modeNameDiv.addEventListener("click", () => {
                Data.mode = modeNameDiv.innerText;
                for (let anotherDiv of Main.modeDivs) {
                    if (!Object.is(modeDiv, anotherDiv)) {
                        anotherDiv.classList.remove("active");
                    }
                    else
                        anotherDiv.classList.add("active");
                }
                if (Data.mode === "center")
                    Main.initCenter();
                else
                    Main.centerDiv?.remove();
                Main.settingTriggerDiv.classList.replace("hide", "show");
            });
        }
        Main.settingTriggerDiv.classList.add("close", "hide");
        Main.settingTriggerDiv.addEventListener("click", Main.closeSelectModePage, { once: true });
        Main.goToCenterRateInput.min = "0";
        Main.goToCenterRateInput.max = "100";
        Main.goToCenterRateInput.step = "5";
        Main.goToCenterRateInput.value = `${Data.goToCenterRate}`;
        Main.goToCenterRateOutput.value = `${Data.goToCenterRate}%`;
        Main.goToCenterRateInput.addEventListener("input", () => {
            Data.goToCenterRate = parseInt(Main.goToCenterRateInput.value);
            Main.goToCenterRateOutput.value = `${Data.goToCenterRate}%`;
        });
        Main.populationInput.min = "1";
        Main.populationInput.max = "500";
        Main.populationInput.step = "5";
        Main.populationInput.value = `${Data.population}`;
        Main.populationOutput.value = `${Data.population}`;
        Main.populationInput.addEventListener("input", () => {
            Data.population = parseInt(Main.populationInput.value);
            Main.populationOutput.value = `${Data.population}`;
        });
        Main.energyInput.min = "0";
        Main.energyInput.max = "10";
        Main.energyInput.step = "1";
        Main.energyInput.value = `${Data.energy}`;
        Main.energyOutput.value = `${Data.energy}`;
        Main.energyInput.addEventListener("input", () => {
            Data.energy = parseInt(Main.energyInput.value);
            Main.energyOutput.value = `${Data.energy}`;
        });
        Main.initialInfectedRateInput.min = "0";
        Main.initialInfectedRateInput.max = "100";
        Main.initialInfectedRateInput.step = "1";
        Main.initialInfectedRateInput.value = `${Data.initialInfectedRate}`;
        Main.initialInfectedRateOutput.value = `${Data.initialInfectedRate}`;
        Main.initialInfectedRateInput.addEventListener("input", () => {
            Data.initialInfectedRate = parseInt(Main.initialInfectedRateInput.value);
            Main.initialInfectedRateOutput.value = `${Data.initialInfectedRate}`;
        });
        Main.virusPowerInput.min = "0.01";
        Main.virusPowerInput.max = "1";
        Main.virusPowerInput.step = "0.01";
        Main.virusPowerInput.value = `${Data.virusPower}`;
        Main.virusPowerOutput.value = `${Data.virusPower}`;
        Main.virusPowerInput.addEventListener("input", () => {
            Data.virusPower = parseFloat(Main.virusPowerInput.value);
            Main.virusPowerOutput.value = `${Data.virusPower}`;
        });
        Main.effectiveRangeInput.min = "10";
        Main.effectiveRangeInput.max = "40";
        Main.effectiveRangeInput.step = "1";
        Main.effectiveRangeInput.value = `${Data.effectiveRange}`;
        Main.effectiveRangeOutput.value = `${Data.effectiveRange}`;
        Main.effectiveRangeInput.addEventListener("input", () => {
            Data.effectiveRange = parseInt(Main.effectiveRangeInput.value);
            Main.effectiveRangeOutput.value = `${Data.effectiveRange}`;
        });
        Main.recoverDayInput.min = "1";
        Main.recoverDayInput.max = "7";
        Main.recoverDayInput.step = "1";
        Main.recoverDayInput.value = `${Data.recoverDay}`;
        Main.recoverDayOutput.value = `${Data.recoverDay}`;
        Main.recoverDayInput.addEventListener("input", () => {
            Data.recoverDay = parseInt(Main.recoverDayInput.value);
            Main.recoverDayOutput.value = `${Data.recoverDay}`;
        });
        Main.startButton.classList.add("start");
        Main.startButton.addEventListener("click", Main.start, { once: true });
        Main.stopButton.classList.add("disabled");
    }
    static openSelectModePage = () => {
        Main.selectModePageDiv.classList.remove("hide");
        Main.settingTriggerDiv.classList.remove("open");
        Main.settingTriggerDiv.classList.add("close");
        if (Data.mode)
            Main.settingTriggerDiv.classList.add("show");
        else
            Main.settingTriggerDiv.classList.add("hide");
        Main.settingTriggerDiv.addEventListener("click", Main.closeSelectModePage, { once: true });
    };
    static closeSelectModePage = () => {
        Main.selectModePageDiv.classList.add("hide");
        Main.settingTriggerDiv.classList.replace("close", "open");
        Main.settingTriggerDiv.classList.remove("show", "hide");
        Main.settingTriggerDiv.addEventListener("click", Main.openSelectModePage, { once: true });
    };
    static initCenter() {
        Main.centerDiv = document.createElement("div");
        Main.centerDiv.id = "center";
        Main.mainDiv.appendChild(Main.centerDiv);
    }
    static start = () => {
        Main.startButton.classList.replace("start", "pause");
        Main.populationInput.disabled = true;
        Main.energyInput.disabled = true;
        Main.initialInfectedRateInput.disabled = true;
        Main.virusPowerInput.disabled = true;
        Main.effectiveRangeInput.disabled = true;
        Main.recoverDayInput.disabled = true;
        if (Data.status === "stopped") {
            for (let i = 0; i < Data.population; i++) {
                let dot;
                if (i < (Data.initialInfectedRate / 100) * Data.population) {
                    dot = new Dot(Data.energy, Data.recoverDay);
                    dot.getInfected();
                }
                else {
                    dot = new Dot(Data.energy, Data.recoverDay);
                }
                Data.dots.push(dot);
                dot.isRecorded = true;
            }
            Main.stopButton.addEventListener("click", Main.stop, {
                once: true,
            });
            Main.stopButton.classList.remove("disabled");
            this.lineChart = new LineChart();
        }
        else if (Data.status === "paused") {
        }
        else
            throw Error("The simulation has already been running.");
        Data.status = "running";
        Main.run();
        Main.startButton.addEventListener("click", Main.pause, { once: true });
        Main.updateChartInterval = setInterval(() => {
            Data.day++;
            this.lineChart?.chart.data.labels.push(Data.day);
            this.lineChart?.chart.data.datasets[0].data.push(Data.dots.filter((dot) => dot.status === "infected").length /
                Data.population);
            this.lineChart?.chart.data.datasets[1].data.push(Data.dots.filter((dot) => dot.status !== "healthy").length /
                Data.population);
            this.lineChart?.chart.update();
        }, 1000);
    };
    static pause = () => {
        Main.startButton.classList.replace("pause", "start");
        Data.status = "paused";
        Main.startButton.addEventListener("click", Main.start, { once: true });
        clearInterval(Main.updateChartInterval);
    };
    static stop = () => {
        Data.status = "stopped";
        Main.startButton.classList.remove("pause");
        Main.startButton.classList.add("start");
        Main.startButton.removeEventListener("click", Main.pause);
        Main.startButton.removeEventListener("click", Main.start);
        Main.startButton.addEventListener("click", Main.start, { once: true });
        Data.dots.forEach((dot) => dot.div.remove());
        Data.dots = [];
        clearInterval(Main.updateChartInterval);
        Data.day = 0;
        Main.lineChart?.chart.destroy();
        Main.populationInput.disabled = false;
        Main.energyInput.disabled = false;
        Main.initialInfectedRateInput.disabled = false;
        Main.virusPowerInput.disabled = false;
        Main.effectiveRangeInput.disabled = false;
        Main.recoverDayInput.disabled = false;
        Main.stopButton.removeEventListener("click", Main.stop);
        Main.stopButton.classList.add("disabled");
    };
    static run() {
        Data.dots.forEach((dot) => {
            dot.move();
            Main.checkHealthStatus(dot);
        });
        if (Data.status === "running")
            requestAnimationFrame(Main.run);
    }
    static checkHealthStatus(dot) {
        if (dot.status === "healthy") {
            for (const anotherDot of Data.dots) {
                if (!Object.is(dot, anotherDot) &&
                    anotherDot.status === "infected") {
                    const distance = Math.sqrt(Math.pow(dot.position[0] - anotherDot.position[0], 2) +
                        Math.pow(dot.position[1] - anotherDot.position[1], 2));
                    const p = (Data.virusPower * (Data.effectiveRange - distance)) /
                        Data.effectiveRange;
                    if (Math.random() < p)
                        dot.getInfected();
                }
            }
        }
    }
}
Main.main();
