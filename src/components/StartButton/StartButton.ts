import { fabric } from 'fabric';
import { GlassButtonShape } from './GlassButtonShape';

export class StartButtonShape {
  constructor(canvas: fabric.Canvas, x: number, y: number) {
    new GlassButtonShape(canvas, x, y, 'ПУСК', () => {
      console.log('НАЖАТИЕ! (fetch сейчас пойдёт)');
    
      fetch('http://localhost:3000/api/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'start', time: new Date().toISOString() }),
      })
        .then(res => res.json())
        .then(data => {
          console.log('Ответ от сервера:', data);
        })
        .catch(err => {
          console.error('Ошибка запроса:', err);
        });

    });
    
  }
}
