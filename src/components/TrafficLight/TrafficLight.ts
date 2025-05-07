import { fabric } from 'fabric';

type LightColor = 'red' | 'yellow' | 'green';

export class TrafficLight {
  // Все экземпляры для глобального переключения
  private static instances: TrafficLight[] = [];

  group: fabric.Group;
  private redLight: fabric.Circle;
  private yellowLight: fabric.Circle;
  private greenLight: fabric.Circle;
  private button: fabric.Circle;

  constructor(
    private canvas: fabric.Canvas,
    private x: number,
    private y: number
  ) {
    const pole = new fabric.Rect({
      left: 0, top: 0,
      width: 10, height: 120,
      fill: '#333',
      rx: 5, ry: 5,
      selectable: false
    });

    const housing = new fabric.Rect({
      left: -20, top: -100,
      width: 50, height: 100,
      fill: '#111',
      rx: 8, ry: 8,
      stroke: 'rgba(255,255,255,0.3)',
      strokeWidth: 2,
      shadow: new fabric.Shadow({ color: '#000', blur: 10 }),
      selectable: false
    });

    const r = 12;
    this.redLight = new fabric.Circle({
      left: 5, top: -80,
      radius: r,
      fill: '#330000',
      stroke: 'rgba(255,0,0,0.8)',
      strokeWidth: 2,
      shadow: new fabric.Shadow({ color: 'rgba(255,0,0,0.6)', blur: 15 }),
      originX: 'center', originY: 'center',
      selectable: false
    });

    this.yellowLight = new fabric.Circle({
      left: 5, top: -50,
      radius: r,
      fill: '#333300',
      stroke: 'rgba(255,255,0,0.8)',
      strokeWidth: 2,
      shadow: new fabric.Shadow({ color: 'rgba(255,255,0,0.6)', blur: 15 }),
      originX: 'center', originY: 'center',
      selectable: false
    });

    this.greenLight = new fabric.Circle({
      left: 5, top: -20,
      radius: r,
      fill: '#003300',
      stroke: 'rgba(0,255,0,0.8)',
      strokeWidth: 2,
      shadow: new fabric.Shadow({ color: 'rgba(0,255,0,0.8)', blur: 15 }),
      originX: 'center', originY: 'center',
      selectable: false
    });

    // Кнопка на палке
// вместо radius: 8
    this.button = new fabric.Circle({
        left: 5,
        top: 50,
        radius: 10,                     // чуть больше
        fill: '#222',
        stroke: 'rgba(0,255,255,0.8)',
        strokeWidth: 2,
        shadow: new fabric.Shadow({ color: 'rgba(0,255,255,0.6)', blur: 10 }),
        originX: 'center', originY: 'center',
        hoverCursor: 'pointer',
        selectable: false,
        evented: true                   // <— важно, чтобы кнопка реагировала на клики
    });
  

    // Собираем всё в группу
    this.group = new fabric.Group(
        [ pole, housing, this.redLight, this.yellowLight, this.greenLight, this.button ],
        {
          left: x,
          top: y,
          hasControls: false,
          hasBorders: false,
          subTargetCheck: true    // <— разрешаем клики по вложенным фигурам
        }
      );
      

    canvas.add(this.group);
    TrafficLight.instances.push(this);

    // Клик по кнопке запускает цикл
    this.button.on('mousedown', () => TrafficLight.startCycle(this));
    // Сразу устанавливаем начальное состояние — красный
    this.setAll('red', this);
  }

  // Устанавливает цвет активного и неактивного для всех
  private setAll(active: LightColor, clicked: TrafficLight) {
    TrafficLight.instances.forEach(inst => {
      inst.setLight('red');
      inst.setLight(active, clicked === inst);
    });
  }


  public setPosition(left: number, top: number): void {
    this.group.set({ left, top });
    // если нужно, чтобы хитбокс соответствовал новой позиции:
    this.group.setCoords();
    // отрендерить холст заново
    this.canvas.requestRenderAll();
  }

  // Устанавливает один свет (кликнутый — ярко, остальные — фоново)
  private setLight(color: LightColor, isActive: boolean = false) {
    const map: Record<LightColor, fabric.Circle> = {
      red: this.redLight,
      yellow: this.yellowLight,
      green: this.greenLight
    };
    Object.entries(map).forEach(([key, circle]) => {
      if (key === color) {
        circle.set({
          fill: isActive ? key : this.dimColor(key as LightColor)
        });
      } else {
        circle.set({ fill: this.dimColor(key as LightColor) });
      }
    });
    this.canvas.requestRenderAll();
  }

  private dimColor(color: LightColor): string {
    switch (color) {
      case 'red':    return '#330000';
      case 'yellow': return '#333300';
      case 'green':  return '#003300';
    }
  }

  // Запускает общий цикл: 8 сек -> жёлтый -> 2 сек -> зелёный / остальные красный
  private static startCycle(clicked: TrafficLight) {
    // отключаем повторный клик
    TrafficLight.instances.forEach(i => i.button.off('mousedown'));
    // через 8 сек все становятся жёлтыми
    setTimeout(() => {
      TrafficLight.instances.forEach(i => i.setLight('yellow', true));
      // через 2 сек зелёный у того, кто кликнул
      setTimeout(() => {
        TrafficLight.instances.forEach(i => {
          if (i === clicked) i.setLight('green', true);
          else i.setLight('red', true);
        });
        // восстановим слушатели
        TrafficLight.instances.forEach(i =>
          i.button.on('mousedown', () => TrafficLight.startCycle(i))
        );
      }, 2000);
    }, 8000);
  }
}
