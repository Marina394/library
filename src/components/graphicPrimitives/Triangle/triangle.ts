import {fabric} from 'fabric';


export class TriangleShape extends fabric.Triangle {
    private canvas: any;

    constructor(canvas: any, x: number, y: number) {
        const side = 100;
        const height = (side * Math.sqrt(3)) / 2; // Высота равностороннего треугольника

        super({
            width: side,
            height: height,
            fill: 'rgba(255, 0, 0, 0)',
            stroke: 'rgba(0, 0, 0, 1)',
            strokeWidth: 1,
            strokeUniform: true,
            originX: 'center',
            originY: 'top',
            left: x,
            top: y,
            angle: 0
        });
        this.canvas = canvas;

        this.canvas.add(this);
        this.canvas.requestRenderAll();
    }
}