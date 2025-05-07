import { fabric } from 'fabric';
import { GlassButtonShape1 } from '../StopButton/GlassButtonShape1';

export class StopButtonShape {
  constructor(canvas: fabric.Canvas, x: number, y: number) {
    new GlassButtonShape1(canvas, x, y, 'СТОП', () => {
      console.log('Нажата кнопка СТОП!');
      fetch('http://localhost:3000/api/stop', {  
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'stop', time: new Date().toISOString() }),
      })
        .then(res => res.json())
        .then(data => console.log('Ответ от сервера (СТОП):', data))
        .catch(err => console.error('Ошибка запроса (СТОП):', err));
    });
  }
}
