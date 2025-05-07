import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { fabric } from 'fabric';

Chart.register(...registerables);

export class ChartComponentShape {
  group: fabric.Group;
  private chart: Chart | null = null;
  private chartCanvas: HTMLCanvasElement;
  intervalId: number;

  constructor(
    private canvas: fabric.Canvas,
    x: number,
    y: number
  ) {
    // Создаем canvas для Chart.js
    this.chartCanvas = document.createElement('canvas');
    this.chartCanvas.width = 400;
    this.chartCanvas.height = 300;
    this.chartCanvas.style.pointerEvents = 'none'; // Отключаем взаимодействие
    
    // Создаем фон для Fabric.js
    const background = new fabric.Rect({
      width: 400,
      height: 300,
      fill: 'rgba(20, 20, 20, 0.9)',
      rx: 10,
      ry: 10,
      stroke: 'rgba(0, 255, 0, 0.5)',
      strokeWidth: 2,
      selectable: false,
    });

    // Создаем невидимый прямоугольник для перемещения
    const dragArea = new fabric.Rect({
      width: 400,
      height: 300,
      fill: 'rgba(0,0,0,0.01)', // Почти прозрачный
      hoverCursor: 'move',
      hasControls: false,
      hasBorders: false,
    });

    // Группируем элементы
    this.group = new fabric.Group([background, dragArea], {
      left: x,
      top: y,
      hasControls: false,
      hasBorders: false,
    });

    // Добавляем группу на canvas Fabric.js
    this.canvas.add(this.group);
    
    // Инициализируем график
    this.initChart();
    
    // Первый запрос данных и настройка интервала
    this.fetchData();
    this.intervalId = window.setInterval(() => this.fetchData(), 3000);

    // Обработчик перемещения группы
    this.group.on('moving', () => this.updateChartPosition());
  }

  private initChart() {
    const ctx = this.chartCanvas.getContext('2d');
    if (!ctx) return;


    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Значения',
          data: [],
          borderColor: '#00ff00',
          backgroundColor: 'rgba(0, 255, 0, 0.1)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        animation: {
          duration: 0 // Отключаем анимацию для мгновенного обновления
        },
        scales: {
          x: {
            title: { display: true, text: 'Время', color: '#00ff00' },
            grid: { color: 'rgba(0, 255, 0, 0.1)' },
            ticks: { color: '#00ff00' }
          },
          y: {
            title: { display: true, text: 'Значение', color: '#00ff00' },
            min: 0,
            max: 100,
            grid: { color: 'rgba(0, 255, 0, 0.1)' },
            ticks: { color: '#00ff00' }
          }
        },
        plugins: {
          legend: {
            labels: { color: '#00ff00' }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
    
    // Добавляем canvas Chart.js поверх Fabric.js
    const canvasEl = this.canvas.getElement();
    canvasEl.parentNode?.appendChild(this.chartCanvas);
    this.updateChartPosition();
  }

  private updateChartPosition() {
    const groupLeft = this.group.left || 0;
    const groupTop = this.group.top || 0;
    this.chartCanvas.style.position = 'absolute';
    this.chartCanvas.style.left = `${groupLeft}px`;
    this.chartCanvas.style.top = `${groupTop}px`;
  }

  private async fetchData() {
    try {
      const response = await fetch('http://localhost:3000/api/history');
      const data = await response.json();

      if (Array.isArray(data) && this.chart) {
        const labels = data.map(item => 
          new Date(item.time).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        );
        const values = data.map(item => item.value);

        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = values;
        this.chart.update();
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  }

  destroy() {
    clearInterval(this.intervalId);
    this.chart?.destroy();
    this.chartCanvas.remove();
    this.canvas.remove(this.group);
  }
}