import { fabric } from 'fabric';

export class TextStatusIndicatorShape {
  group: fabric.Group;
  textObj: fabric.Text;
  intervalId: number;

  constructor(
    canvas: fabric.Canvas,
    x: number,
    y: number,
    initialStatus: string = 'Ожидание'
  ) {
    const width = 180;
    const height = 70;

    // фон
    const background = new fabric.Rect({
      width, height,
      rx: 12, ry: 12,
      fill: new fabric.Gradient({
        type: 'linear', gradientUnits: 'pixels',
        coords: { x1:0,y1:0,x2:1,y2:0 },
        colorStops: [
          { offset: 0, color: 'rgba(20,20,20,0.95)' },
          { offset: 1, color: 'rgba(50,50,50,0.95)' }
        ]
      }),
      stroke: 'rgba(255,255,255,0.6)', strokeWidth: 2,
      shadow: new fabric.Shadow({ color: 'rgba(0,255,128,0.3)', blur: 15 })
    });

    // текст (статус)
    this.textObj = new fabric.Text(initialStatus, {
      fontSize: 22, fontFamily: 'Arial',
      originX: 'center', originY: 'center',
      left: width/2, top: height/2,
      fill: '#00ff00',
      shadow: new fabric.Shadow({ color:'rgba(0,255,0,0.6)', blur:10 })
    });

    this.group = new fabric.Group([background, this.textObj], {
      left: x, top: y,
      hasControls: false, hasBorders: false,
      hoverCursor: 'default'
    });
    canvas.add(this.group);

    // сразу опрос и каждые 3с
    this.fetchStatus();
    this.intervalId = window.setInterval(() => this.fetchStatus(), 3000);
  }

  private fetchStatus() {
    fetch('http://localhost:3000/api/system-status')
      .then(res => res.json())
      .then(data => {
        // data.running === true/false
        if (data.running) {
          this.textObj.set({ 
            text: 'ВКЛЮЧЕНО', 
            fill: '#00ff00',
            shadow: new fabric.Shadow({ color:'rgba(0,255,0,0.8)', blur:10 })
          });
        } else {
          this.textObj.set({ 
            text: 'ОЖИДАНИЕ', 
            fill: '#ff0000',
            shadow: new fabric.Shadow({ color:'rgba(255,0,0,0.8)', blur:10 })
          });
        }
        this.group.canvas?.requestRenderAll();
      })
      .catch(console.error);
  }
}
