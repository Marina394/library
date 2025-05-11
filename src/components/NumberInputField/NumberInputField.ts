import { fabric } from 'fabric';

export class NumberInputField {
  group: fabric.Group;
  input: fabric.IText;
  private canvas: fabric.Canvas;
  

  constructor(canvas: fabric.Canvas, x: number, y: number) {
    this.canvas = canvas;
    const width = 220;
    const height = 70;
    

    // Фон
    const background = new fabric.Rect({
      width,
      height,
      rx: 12,
      ry: 12,
      fill: new fabric.Gradient({
        type: 'linear',
        gradientUnits: 'percentage',
        coords: { x1: 0, y1: 0, x2: 1, y2: 0 },
        colorStops: [
          { offset: 0, color: 'rgba(20, 20, 20, 0.95)' },
          { offset: 1, color: 'rgba(40, 40, 40, 0.95)' }
        ]
      }),
      stroke: '#00ffaa',
      strokeWidth: 2,
    });

    // Кнопка "ОК"
    const okButton = new fabric.Rect({
      width: 60,
      height: 40,
      rx: 8,
      ry: 8,
      fill: '#00ff00',
      left: width - 70,
      top: height / 2,
      originY: 'center',
      selectable: false,
      evented: true,
      hoverCursor: 'pointer'
    });

    const okText = new fabric.Text('OK', {
      fontSize: 18,
      fill: '#000',
      originX: 'center',
      originY: 'center',
      left: okButton.left! + okButton.width! / 2,
      top: okButton.top,
      fontWeight: 'bold',
      hoverCursor: 'pointer',
      evented: true
    });

    this.group = new fabric.Group([background, okButton, okText], {
      left: x,
      top: y,
      hasControls: false,
      subTargetCheck: true
    });

    this.input = new fabric.IText('', {
      left: x + 20,
      top: y + height / 2,
      fontSize: 28,
      fontWeight: 'bold',
      fill: '#00ffcc',
      fontFamily: 'monospace',
      originY: 'center',
      editable: true,
      selectable: true,
      evented: true,
      hoverCursor: 'text',
      shadow: new fabric.Shadow({ color: '#00ffcc', blur: 8 }),
      width: width - 90,
      styles: {},
      backgroundColor: 'rgba(0,0,0,0.3)'
    });
    

    this.input.on('changed', () => {
        const clean = this.input.text?.replace(/\D/g, '').slice(0, 6) ?? '';
        if (this.input.text !== clean) {
          this.input.text = clean;
          
          // Установим курсор в конец
          this.input.selectionStart = clean.length;
          this.input.selectionEnd = clean.length;
      
          canvas.requestRenderAll();
        }
      });
      

    this.input.on('mousedblclick', () => {
      this.activateInput();
    });

    okText.on('mousedown', () => {
      const value = Number(this.input.text || '0');
      console.log('Отправка:', value);
      
      okButton.set('fill', '#00cc77');
      this.canvas.renderAll();
      
      setTimeout(() => {
        okButton.set('fill', '#00ff00');
        this.canvas.renderAll();
        
        fetch('http://localhost:3000/api/value', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value })
        }).catch(console.error);
        
        this.activateInput();
      }, 150);
    });

    this.canvas.add(this.group);
    this.canvas.add(this.input);
    this.input.bringToFront();

    this.group.on('moving', () => {
      this.input.set({
        left: this.group.left! + 20,
        top: this.group.top! + height / 2
      });
      this.input.bringToFront();
      this.canvas.renderAll();
    });
    

    setTimeout(() => this.activateInput(), 100);
  }

  private activateInput() {
    this.input.bringToFront();
    this.canvas.setActiveObject(this.input);
    this.input.enterEditing();
    this.input.selectAll();
    this.canvas.renderAll();
  }
}