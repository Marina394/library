import { fabric } from 'fabric';

export class VerticalIndicator extends fabric.Group {
    private canvas: any;

    constructor(canvas: any, x: number, y: number, start: number = 0, end: number = 140, step: number = 10) {
        const items = [];
        const rectHeight = 300; // Высота основного индикатора
        const rectWidth = 50;   // Ширина основного индикатора
        const numSteps = Math.floor((end - start) / step); // Количество отметок
        const stepHeight = rectHeight / (numSteps + 1); // Высота одного шага
        const fontSize = Math.max(8, Math.min(12, 300 / (numSteps + 1) / 1.5)); // Динамический размер шрифта
        const textPadding = 5; // Отступ текста от края основного прямоугольника
        const textWidth = 25; // Приблизительная ширина текста

        // Создаём основной прямоугольник с скруглёнными краями
        const rectangle = new fabric.Rect({
            left: x,
            top: y,
            fill: 'grey',
            width: rectWidth,
            height: rectHeight,
            rx: 5, // радиус скругления углов
            ry: 5
        });
        items.push(rectangle);

        // Создаём внутренний прямоугольник с скруглёнными краями, правее текста
        const innerRectangle = new fabric.Rect({
            left: x + rectWidth, // расположение с учётом ширины текста и прямоугольника
            top: y + stepHeight / 2, // вертикальный отступ, чтобы не перекрывать первую и последнюю метку
            fill: 'lightblue', // изменяем цвет для лучшего визуального различия
            width: rectWidth / 2, // уменьшенная ширина
            height: rectHeight - stepHeight, // уменьшенная высота, чтобы не перекрывать текст
            rx: 3, // меньший радиус скругления
            ry: 3
        });
        items.push(innerRectangle);

        // Создаем текстовые метки для каждого значения
        for (let i = 0; i <= numSteps; i++) {
            const value = start + i * step;
            const text = new fabric.Text(value.toString() + "     -", {
                left: x + textPadding, // небольшой отступ от края прямоугольника
                top: y + i * stepHeight - fontSize / 2 + stepHeight / 2, // центрирование текста по вертикали
                fontSize: fontSize,
                fill: 'white'
            });
            items.push(text);
        }

        super(items, {
            selectable: true,
            evented: true,
        });

        this.canvas = canvas;
        this.canvas.add(this);
        this.canvas.renderAll();
    }
}
