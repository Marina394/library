import { fabric } from 'fabric';

export class ToggleButtonShape extends fabric.Group {
    constructor(canvas: any, x: number, y: number, width: number = 120, height: number = 50) {
        // Создаем основной прямоугольник кнопки
        const rectangle = new fabric.Rect({
            left: 0,
            top: 0,
            width: width,
            height: height,
            fill: 'green', // Начальный цвет
            rx: 20, // Скругление углов
            ry: 20,
            stroke: 'black',
            strokeWidth: 2,
            shadow: new fabric.Shadow({
                color: 'rgba(0,0,0,0.2)',
                blur: 10,
                offsetX: 3,
                offsetY: 3,
            }),
        });

        // Создаем текст для кнопки
        const text = new fabric.Text('ON', {
            left: width / 2,
            top: height / 2,
            fontSize: 18,
            fontWeight: 'bold',
            fill: 'white',
            originX: 'center',
            originY: 'center',
        });

        // Передаем элементы в группу
        super([rectangle, text], { left: x, top: y });

        // Добавляем логику переключения состояния
        this.on('mousedown', () => {
            const isOn = rectangle.fill === 'green';
            rectangle.set('fill', isOn ? 'red' : 'green');
            text.set('text', isOn ? 'OFF' : 'ON');

            // Анимация нажатия
            rectangle.animate('scaleX', 0.9, {
                duration: 100,
                onChange: canvas.renderAll.bind(canvas),
                onComplete: () => {
                    rectangle.animate('scaleX', 1, {
                        duration: 100,
                        onChange: canvas.renderAll.bind(canvas),
                    });
                },
            });

            canvas.renderAll();
        });

        // Добавляем кнопку на холст
        canvas.add(this);
    }
}
