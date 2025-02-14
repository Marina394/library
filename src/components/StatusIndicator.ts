import { fabric } from 'fabric';

export class StatusIndicatorShape extends fabric.Group {
    constructor(canvas: any, x: number, y: number, radius: number = 40) {
        const items = [];

        // Свечение с рассеиванием света
        const glow = new fabric.Circle({
            left: 0,
            top: 0,
            radius: radius + 40, // Расширяем радиус для рассеивания
            originX: 'center',
            originY: 'center',
            fill: new fabric.Gradient({
                type: 'radial',
                coords: { x1: radius + 40, y1: radius + 40, r1: 0, x2: radius + 40, y2: radius + 40, r2: radius + 40 },
                colorStops: [
                    { offset: 0, color: 'rgba(255, 0, 0, 0.5)' }, // Яркий центр
                    { offset: 1, color: 'rgba(255, 0, 0, 0)' },   // Прозрачный край
                ],
            }),
        });

        // Основная часть лампочки
        const glassBulb = new fabric.Circle({
            left: 0,
            top: 0,
            radius: radius,
            fill: 'rgba(200, 200, 255, 0.5)', // Цвет стекла
            stroke: 'black',
            strokeWidth: 2,
            originX: 'center',
            originY: 'center',
        });

        // Блик на лампочке
        const highlight = new fabric.Circle({
            left: -radius / 3,
            top: -radius / 3,
            radius: radius / 6,
            fill: 'rgba(255, 255, 255, 0.8)', // Блик
            originX: 'center',
            originY: 'center',
        });

        // Добавляем элементы в группу
        items.push(glow, glassBulb, highlight);
        super(items, {
            left: x - radius,
            top: y - radius,
        });

        // Логика переключения цвета и свечения
        this.on('mousedown', () => {
            const currentColor = glassBulb.fill as string;

            let nextColor: string;
            let glowGradient: fabric.Gradient;

            switch (currentColor) {
                case 'rgba(200, 200, 255, 0.5)': // Стекло (покой) → Жёлтый
                    nextColor = 'yellow';
                    glowGradient = new fabric.Gradient({
                        type: 'radial',
                        coords: { x1: radius + 40, y1: radius + 40, r1: 0, x2: radius + 40, y2: radius + 40, r2: radius + 40 },
                        colorStops: [
                            { offset: 0, color: 'rgba(255, 255, 0, 0.5)' }, // Жёлтое свечение
                            { offset: 1, color: 'rgba(255, 255, 0, 0)' },
                        ],
                    });
                    break;
                case 'yellow': // Жёлтый → Красный
                    nextColor = 'red';
                    glowGradient = new fabric.Gradient({
                        type: 'radial',
                        coords: { x1: radius + 40, y1: radius + 40, r1: 0, x2: radius + 40, y2: radius + 40, r2: radius + 40 },
                        colorStops: [
                            { offset: 0, color: 'rgba(255, 0, 0, 0.5)' }, // Красное свечение
                            { offset: 1, color: 'rgba(255, 0, 0, 0)' },
                        ],
                    });
                    break;
                case 'red': // Красный → Зелёный
                    nextColor = 'green';
                    glowGradient = new fabric.Gradient({
                        type: 'radial',
                        coords: { x1: radius + 40, y1: radius + 40, r1: 0, x2: radius + 40, y2: radius + 40, r2: radius + 40 },
                        colorStops: [
                            { offset: 0, color: 'rgba(0, 255, 0, 0.5)' }, // Зелёное свечение
                            { offset: 1, color: 'rgba(0, 255, 0, 0)' },
                        ],
                    });
                    break;
                case 'green': // Зелёный → Стекло (покой)
                    nextColor = 'rgba(200, 200, 255, 0.5)'; // Цвет стекла
                    glowGradient = new fabric.Gradient({
                        type: 'radial',
                        coords: { x1: radius + 40, y1: radius + 40, r1: 0, x2: radius + 40, y2: radius + 40, r2: radius + 40 },
                        colorStops: [
                            { offset: 0, color: 'rgba(0, 0, 0, 0)' }, // Без свечения
                            { offset: 1, color: 'rgba(0, 0, 0, 0)' },
                        ],
                    });
                    break;
                default: // Восстановление стекла
                    nextColor = 'rgba(200, 200, 255, 0.5)';
                    glowGradient = new fabric.Gradient({
                        type: 'radial',
                        coords: { x1: radius + 40, y1: radius + 40, r1: 0, x2: radius + 40, y2: radius + 40, r2: radius + 40 },
                        colorStops: [
                            { offset: 0, color: 'rgba(0, 0, 0, 0)' }, // Без свечения
                            { offset: 1, color: 'rgba(0, 0, 0, 0)' },
                        ],
                    });
            }

            // Применяем изменения
            glassBulb.set('fill', nextColor);
            glow.set('fill', glowGradient);
            canvas.renderAll();
        });

        // Добавляем элемент на холст
        canvas.add(this);
    }
}
