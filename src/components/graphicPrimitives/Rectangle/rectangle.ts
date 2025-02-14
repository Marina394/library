import {fabric} from 'fabric';


export class RectangleShape extends fabric.Rect {
    private canvas: any;

    constructor(canvas: any, x: number, y: number) {
        super({
            width: 80,
            height: 40,
            fill: 'rgba(255, 0, 0, 0)',
            stroke: 'rgba(0, 0, 0, 1)',
            strokeWidth: 1,
            strokeUniform: true,
            left: x,
            top: y,
            originX: 'left',
            originY: 'top',
            hasControls: true
        });
        this.canvas = canvas;

        this.canvas.add(this);
        this.canvas.requestRenderAll();
    }

}
