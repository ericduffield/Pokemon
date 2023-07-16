import { context } from "../../globals.js";
import { roundedRectangle } from "../../../lib/DrawingHelpers.js";
import Colour from "../../enums/Colour.js";
import {
    timer,
} from "../../globals.js";


export default class ProgressBar {
    static WIDTH = 160;
    static HEIGHT = 8;

    constructor(x, y, width, height, color, currentValue = 0, maxValue) {
        this.position = { x, y };
        this.dimensions = { x: width, y: height };

        this.color = color;
        this.currentValue = currentValue;
        this.maxValue = maxValue;
    }

    render() {
        context.save();

        roundedRectangle(context, this.position.x, this.position.y, this.dimensions.x, this.dimensions.y, 4, true, false);

        context.fillStyle = Colour.White;
        roundedRectangle(context, this.position.x + 1, this.position.y + 1, this.dimensions.x - 2, this.dimensions.y - 2, 4, true, false);


        if (this.currentValue > 0) {
            context.fillStyle = this.color;
            roundedRectangle(context, this.position.x + 1, this.position.y + 1, (this.currentValue / this.maxValue) * (this.dimensions.x - 2), this.dimensions.y - 2, 4, true, false);
        }

        context.restore();

    }

    update(newValue, duration, color = this.color) {
        timer.tween(
            this,
            ['currentValue'],
            [newValue],
            duration,
            () => this.updateColor(color)
        );
    }

    updateColor(color) {
        this.color = color;
    }
}