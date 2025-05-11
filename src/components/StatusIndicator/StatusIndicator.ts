import { fabric } from 'fabric';

export class StatusIndicatorShape extends fabric.Group {
  private circle: fabric.Circle;
  private intervalId?: number;

  constructor(canvas: fabric.Canvas, x: number, y: number) {
    // Неоново-тёмный фон
    const background = new fabric.Rect({
      width: 80,
      height: 80,
      fill: 'rgba(30,30,30,0.9)',
      rx: 12,
      ry: 12,
      stroke: 'rgba(255,255,255,0.2)',
      strokeWidth: 1,
    });

    // Лампочка (по умолчанию выключена)
    const circle = new fabric.Circle({
      radius: 18,
      fill: 'rgba(0, 0, 0, 0.4)', // тёмный
      stroke: 'rgba(255,255,255,0.1)',
      strokeWidth: 2,
      shadow: new fabric.Shadow({
        color: 'rgba(0,255,0,0.0)',
        blur: 10,
        offsetX: 0,
        offsetY: 0,
      }),
      left: 40,
      top: 40,
      originX: 'center',
      originY: 'center',
    });

    super([background, circle], {
      left: x,
      top: y,
      hasControls: false,
      hasBorders: false,
      hoverCursor: 'pointer',
    });

    this.circle = circle;

    canvas.add(this);
    this.startPolling();
  }

  // Обновление внешнего вида по состоянию
  updateState(isOn: boolean) {
    this.circle.set('fill', isOn ? '#00ff00' : 'rgba(0,0,0,0.4)');
    this.circle.set('shadow', new fabric.Shadow({
      color: isOn ? 'rgba(0,255,0,0.6)' : 'rgba(0,0,0,0)',
      blur: 15,
      offsetX: 0,
      offsetY: 0,
    }));
    this.canvas?.requestRenderAll();
  }

  // Автообновление с сервера
  startPolling() {
    this.intervalId = window.setInterval(() => {
      fetch('http://localhost:3000/api/status-indicator')
        .then(res => res.json())
        .then(data => {
          this.updateState(data?.value === true);
        })
        .catch(err => console.error('Ошибка получения данных:', err));
    }, 3000);
  }
}
