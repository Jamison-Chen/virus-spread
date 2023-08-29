import { Data } from "./main.js";

export default class Dot {
    private static mainDiv: HTMLElement = document.getElementById("main")!;
    public div: HTMLDivElement;
    private energy: number;
    private dayToRecover: number;
    public status: "healthy" | "infected" | "immune";
    public position: [number, number];
    private velocity: [number, number];
    private acceleration: [number, number];
    public isRecorded: boolean;
    public atCenter: boolean;
    public constructor(energy: number, dayToRecover: number) {
        this.energy = energy;
        this.status = "healthy";
        this.dayToRecover = dayToRecover;
        this.position = [
            Math.random() * Dot.mainDiv.clientWidth,
            Math.random() * Dot.mainDiv.clientHeight,
        ];
        this.velocity = this.getVelocity(Math.random() * 360);
        this.acceleration = [0, 0];
        this.isRecorded = false;
        this.atCenter = false;
        this.div = this.createDiv();
    }
    private getVelocity(degree: number): [number, number] {
        return [Math.sin(degree) * this.energy, Math.cos(degree) * this.energy];
    }
    private getAcceleration(): [number, number] {
        return [
            (this.energy / 5) * (Math.random() - 0.5),
            (this.energy / 5) * (Math.random() - 0.5),
        ];
    }
    private createDiv(): HTMLDivElement {
        const div = document.createElement("div");
        div.className = "dot";
        div.style.left = `${this.position[0]}px`;
        div.style.top = `${this.position[1]}px`;
        div.classList.add(this.status);
        Dot.mainDiv.appendChild(div);
        return div;
    }
    public move() {
        if (Data.mode == "classic") {
            this.acceleration = this.getAcceleration();
            const newVelocity: [number, number] = [
                Math.max(
                    Math.min(
                        this.velocity[0] + this.acceleration[0],
                        this.energy
                    ),
                    -this.energy
                ),
                Math.max(
                    Math.min(
                        this.velocity[1] + this.acceleration[1],
                        this.energy
                    ),
                    -this.energy
                ),
            ];

            // Bounce when touching wall
            if (this.position[0] < 0) newVelocity[0] = Math.abs(newVelocity[0]);
            if (this.position[0] > Dot.mainDiv.clientWidth) {
                newVelocity[0] = -Math.abs(newVelocity[0]);
            }
            if (this.position[1] < 0) newVelocity[1] = Math.abs(newVelocity[1]);
            if (this.position[1] > Dot.mainDiv.clientHeight) {
                newVelocity[1] = -Math.abs(newVelocity[1]);
            }

            this.velocity = newVelocity;

            this.position = [
                this.position[0] + this.velocity[0],
                this.position[1] + this.velocity[1],
            ];
        }
        // else {
        //     let centerPos = [
        //         document.getElementById("center").offsetLeft,
        //         document.getElementById("center").offsetTop,
        //     ];
        //     let centerSize = [
        //         document.getElementById("center").offsetWidth,
        //         document.getElementById("center").offsetHeight,
        //     ];
        //     this.position[0] =
        //         Math.random() *
        //             (centerPos[0] +
        //                 centerSize[0] -
        //                 0.5 * (this.width + Dot.size) -
        //                 (centerPos[0] - 0.5 * (this.width - Dot.size))) +
        //         (centerPos[0] - 0.5 * (this.width - Dot.size));
        //     this.position[1] =
        //         Math.random() *
        //             (centerPos[1] +
        //                 centerSize[1] -
        //                 0.5 * (this.height + Dot.size) -
        //                 (centerPos[1] - 0.5 * (this.height - Dot.size))) +
        //         (centerPos[1] - 0.5 * (this.height - Dot.size));
        //     this.atCenter = true;
        // }
        // else if (mode == "outOfCenter") {
        //     this.position = [
        //         Math.random() *
        //             (Dot.mainDiv.clientWidth * 0.8 -
        //                 0.5 * (this.width + Dot.size)),
        //         Math.random() *
        //             (Dot.mainDiv.clientHeight - 0.5 * (this.height + Dot.size)),
        //     ];
        //     this.atCenter = false;
        // }
        // if (this.infected) {
        //     this.infectdDay++;
        //     if (this.infectdDay >= this.recoverDay) {
        //         this.recover();
        //     }
        // }
        this.div.style.left = `${this.position[0]}px`;
        this.div.style.top = `${this.position[1]}px`;
    }
    public getInfected(): void {
        this.status = "infected";
        this.div.classList.add("infected");
        this.div.classList.remove("immune", "healthy");
        setTimeout(this.recover, this.dayToRecover * 1000);
    }
    private recover = (): void => {
        this.status = "immune";
        this.div.classList.add("immune");
        this.div.classList.remove("infected", "healthy");
    };
}
