import { fabric } from 'fabric';

export class SpeedometerShape {
  group: fabric.Group;
  private needle: fabric.Triangle;
  private currentSpeed: number = 0;
  intervalId: number;
  private size: number = 200;
  private center: { x: number, y: number };

  constructor(
    private canvas: fabric.Canvas,
    x: number,
    y: number,
    initialSpeed: number = 0
  ) {
    this.center = { x: x + this.size/2, y: y + this.size/2 };
    this.currentSpeed = initialSpeed;

    // Фон спидометра
    const background = new fabric.Circle({
      radius: this.size / 2,
      left: x,
      top: y,
      fill: 'rgba(30,30,30,0.9)',
      stroke: 'rgba(0,255,0,0.5)',
      strokeWidth: 4,
      originX: 'left',
      originY: 'top'
    });

    // Шкала с делениями
    const scaleGroup = this.createScale();
    
    // Стрелка с правильным позиционированием
    this.needle = new fabric.Triangle({
      width: 15,
      height: this.size * 0.4,
      fill: '#ff0000',
      originX: 'center',
      originY: 'bottom',
      left: this.center.x,
      top: this.center.y,
      angle: this.speedToAngle(initialSpeed),
      shadow: new fabric.Shadow({
        color: 'rgba(255,0,0,0.7)',
        blur: 15,
        offsetX: 0,
        offsetY: 0
      })
    });
    console.log(`Initial needle angle: ${this.needle.angle}°`);

    // Центральная точка
    const centerPin = new fabric.Circle({
      radius: 8,
      fill: '#333',
      stroke: '#fff',
      strokeWidth: 2,
      left: this.center.x,
      top: this.center.y,
      originX: 'center',
      originY: 'center'
    });

    this.group = new fabric.Group([
      background,
      scaleGroup,
      this.needle,
      centerPin
    ], {
      left: 0,
      top: 0,
      hasControls: false,
      hasBorders: false,
    });

    canvas.add(this.group);
    this.fetchSpeed();
    this.intervalId = window.setInterval(() => this.fetchSpeed(), 2000);
  }

private speedToAngle(speed: number): number {
    return -135 + (Math.min(240, Math.max(0, speed)) / 240) * 270;
}

private createScale(): fabric.Group {
    const scaleLines = [];
    const scaleTexts = [];
    const radius = this.size / 2;
    
    // Используем this.center вместо параметров x,y
    const center = this.center;
    
    // Основные деления (каждые 40 км/ч)
    for (let i = 0; i <= 240; i += 40) {
      const angle = this.speedToAngle(i) - 90;
      console.log(`Speed ${i}km/h -> angle ${angle}°`); 
      const rad = angle * Math.PI / 180;
      
      const startX = center.x + Math.cos(rad) * (radius - 20);
      const startY = center.y + Math.sin(rad) * (radius - 20);
      const endX = center.x + Math.cos(rad) * (radius - 5);
      const endY = center.y + Math.sin(rad) * (radius - 5);

      scaleLines.push(new fabric.Line(
        [startX, startY, endX, endY],
        {
          stroke: '#00ff00',
          strokeWidth: 3,
          selectable: false
        }
      ));
      
      // Текст значений
      const textX = center.x + Math.cos(rad) * (radius - 35);
      const textY = center.y + Math.sin(rad) * (radius - 35);
      
      scaleTexts.push(new fabric.Text(i.toString(), {
        left: textX,
        top: textY,
        fontSize: 14,
        fill: '#00ff00',
        fontFamily: 'Arial',
        fontWeight: 'bold',
        originX: 'center',
        originY: 'center',
        selectable: false
      }));
    }

    // Промежуточные деления (каждые 20 км/ч)
    for (let i = 0; i <= 240; i += 20) {
      if (i % 40 === 0) continue;
      
      const angle = this.speedToAngle(i) - 90;
      const rad = angle * Math.PI / 180;
      
      const startX = center.x + Math.cos(rad) * (radius - 15);
      const startY = center.y + Math.sin(rad) * (radius - 15);
      const endX = center.x + Math.cos(rad) * (radius - 5);
      const endY = center.y + Math.sin(rad) * (radius - 5);

      scaleLines.push(new fabric.Line(
        [startX, startY, endX, endY],
        {
          stroke: '#00ff00',
          strokeWidth: 2,
          selectable: false
        }
      ));
    }

    return new fabric.Group([...scaleLines, ...scaleTexts], {
      selectable: false
    });
  }

  private animateNeedle(newSpeed: number) {
    console.log(`Setting speed: ${newSpeed}km/h, angle: ${this.speedToAngle(newSpeed)}°`);
    if (!this.needle) return;
    
    const targetAngle = this.speedToAngle(newSpeed);
    const currentAngle = this.needle.angle ?? this.speedToAngle(this.currentSpeed);

    // Плавная анимация с учетом кругового движения
    fabric.util.animate({
        startValue: currentAngle,
        endValue: targetAngle,
        duration: 800,
        easing: fabric.util.ease.easeOutQuad,
        onChange: (angle) => {
            this.needle?.set('angle', angle);
            this.canvas.requestRenderAll();
        },
        onComplete: () => {
            this.currentSpeed = newSpeed;
        }
    });
}

  private async fetchSpeed() {
    try {
      const response = await fetch('http://localhost:3000/api/speed');
      const data = await response.json();

      if (data.speed !== undefined && !isNaN(Number(data.speed))) {
        const newSpeed = Number(data.speed);
        if (Math.abs(this.currentSpeed - newSpeed) > 0.5) {
          this.animateNeedle(newSpeed);
        }
      }
    } catch (err) {
      console.error('Ошибка получения скорости:', err);
    }
  }

  destroy() {
    clearInterval(this.intervalId);
    this.canvas.remove(this.group);
  }
}