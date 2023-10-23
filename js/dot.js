import { Data } from "./main.js";
export default class Dot {
    static mainDiv = document.getElementById("main");
    div;
    energy;
    dayToRecover;
    status;
    position;
    velocity;
    isRecorded;
    atCenter;
    constructor(energy, dayToRecover) {
        this.energy = energy;
        this.status = "healthy";
        this.dayToRecover = dayToRecover;
        this.position = [
            Math.random() * Dot.mainDiv.clientWidth,
            Math.random() * Dot.mainDiv.clientHeight,
        ];
        this.velocity = this.getVelocity(Math.random() * 360);
        this.isRecorded = false;
        this.atCenter = false;
        this.div = this.createDiv();
    }
    getVelocity(degree) {
        return [Math.sin(degree) * this.energy, Math.cos(degree) * this.energy];
    }
    getAcceleration() {
        return [
            (this.energy / 5) * (Math.random() - 0.5),
            (this.energy / 5) * (Math.random() - 0.5),
        ];
    }
    createDiv() {
        const div = document.createElement("div");
        div.className = "dot";
        div.style.left = `${this.position[0]}px`;
        div.style.top = `${this.position[1]}px`;
        div.classList.add(this.status);
        Dot.mainDiv.appendChild(div);
        return div;
    }
    move() {
        if (Data.mode == "classic") {
            let newVelocity;
            if (Math.random() < 0.01) {
                newVelocity = this.getVelocity(Math.random() * 360);
            }
            else {
                const [accelerationX, accelerationY] = this.getAcceleration();
                newVelocity = [
                    Math.max(Math.min(this.velocity[0] + accelerationX, this.energy), -this.energy),
                    Math.max(Math.min(this.velocity[1] + accelerationY, this.energy), -this.energy),
                ];
            }
            if (this.position[0] < 0)
                newVelocity[0] = Math.abs(newVelocity[0]);
            else if (this.position[0] > Dot.mainDiv.clientWidth) {
                newVelocity[0] = -Math.abs(newVelocity[0]);
            }
            if (this.position[1] < 0)
                newVelocity[1] = Math.abs(newVelocity[1]);
            else if (this.position[1] > Dot.mainDiv.clientHeight) {
                newVelocity[1] = -Math.abs(newVelocity[1]);
            }
            this.velocity = newVelocity;
            this.position = [
                this.position[0] + this.velocity[0],
                this.position[1] + this.velocity[1],
            ];
        }
        this.div.style.left = `${this.position[0]}px`;
        this.div.style.top = `${this.position[1]}px`;
    }
    getInfected() {
        this.status = "infected";
        this.div.classList.add("infected");
        this.div.classList.remove("immune", "healthy");
        setTimeout(this.recover, this.dayToRecover * 1000);
    }
    recover = () => {
        this.status = "immune";
        this.div.classList.add("immune");
        this.div.classList.remove("infected", "healthy");
    };
}
