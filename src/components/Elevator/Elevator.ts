import { fabric } from 'fabric';

interface ElevatorStatus {
  id: number;
  currentFloor: number;
  targetFloor: number | null;
  status: 'idle' | 'moving' | 'arrived';
  doorsOpen: boolean;
}



export class Elevator {
  private group!: fabric.Group;
  private currentFloor: number = 1;
  private elevatorId: number;
  private size = { width: 120, height: 200 };
  private intervalId!: number;
  private doorLeft!: fabric.Rect;
  private doorRight!: fabric.Rect;
  private externalDisplay!: fabric.Text;
  private callButton!: fabric.Polygon;
  private isMoving: boolean = false;
  private statusText!: fabric.Text;
  private floorLabel!: fabric.Text;
  private initialX: number;
  private initialY: number;
  private doorsOpen: boolean = false;
  private isAnimating: boolean = false;
  private status: 'idle' | 'moving' | 'arrived';

  constructor(
    private canvas: fabric.Canvas,
    x: number,
    y: number,
    elevatorId: number
  ) {
    this.elevatorId = elevatorId;
    this.initialX = x;
    this.initialY = y;
    this.initializeElevator();
    this.startStatusUpdates();
    this.status = 'idle';
  }

  private initializeElevator() {
    this.createVisualElements();
  }

  private targetFloor: number | null = null;
  
  public updateStatusFromServer(status: ElevatorStatus & { buildingFloor?: number }) {
    if (status.buildingFloor !== undefined) {
      this.setCurrentFloor(status.buildingFloor); // Обновляем этаж здания
    }
    
    // Проверяем, что статус относится к этому лифту
    if (status.id !== this.elevatorId) {
      console.log(`Игнорируем статус для лифта ${status.id} (текущий ${this.elevatorId})`);
      return;
    }

    // Только если ID совпадает
    this.currentFloor = status.currentFloor;
    this.targetFloor = status.targetFloor;
    this.status = status.status;
    
    console.log(`Применяем статус для лифта ${this.elevatorId}:`, status);
    
    this.isMoving = status.status === 'moving'; // Синхронизируем состояние
    this.statusText.set('text', status.status);
    
    this.targetFloor = status.targetFloor;
    this.setCurrentFloor(status.currentFloor);
    this.statusText.set('text', status.status);
    this.statusText.setCoords();
  
    // Управление дверьми
    if (status.status === 'arrived' && !this.doorsOpen) {
      this.animateDoors(true);
    } else if (status.status !== 'arrived' && this.doorsOpen) {
      this.animateDoors(false);
    }
  
    this.canvas.requestRenderAll();
  }
  public setCurrentFloor(newFloor: number) {
    if (this.currentFloor !== newFloor) {
      this.currentFloor = newFloor;
      this.externalDisplay.set('text', newFloor.toString());
      this.externalDisplay.setCoords();
      this.canvas.requestRenderAll();
    }
  }
  
  private createVisualElements() {
    // Корпус лифта
    const body = new fabric.Rect({
      width: this.size.width,
      height: this.size.height,
      left: 0,
      top: 0,
      fill: 'rgba(50, 50, 50, 0.95)',
      stroke: '#00ff00',
      strokeWidth: 2,
      rx: 5,
      ry: 5,
      selectable: false
    });

    const idText = new fabric.Text(`Лифт ${this.elevatorId}\nЭтаж`, {
        left: -60,
        top: this.size.height / 2 - 20,
        fontSize: 16,
        fill: '#00ff00',
        fontFamily: 'Arial',
        textAlign: 'right',
        selectable: false
    });

    // Двери лифта
    const doorWidth = this.size.width / 2 - 8;
    const doorHeight = this.size.height - 20;

    this.floorLabel = new fabric.Text(`${this.elevatorId} этаж`, {
        left: -60, // слева от лифта
        top: this.size.height / 2,
        fontSize: 18,
        fill: '#00ff00',
        originX: 'left',
        originY: 'center',
        fontFamily: 'Arial',
        selectable: false
      });
      
    
    this.doorLeft = new fabric.Rect({
      width: doorWidth,
      height: doorHeight,
      left: 5,
      top: 10,
      fill: 'rgba(70, 70, 70, 0.9)',
      stroke: '#00ff00',
      strokeWidth: 1,
      selectable: false
    });

    this.doorRight = new fabric.Rect({
        width: doorWidth,
        height: doorHeight,
        left: this.size.width - 5, // Правый край
        top: 10,
        fill: 'rgba(70, 70, 70, 0.9)',
        originX: 'right', // Анимация от правого края
        stroke: '#00ff00',
        strokeWidth: 1,
        selectable: false
    });

    // Внешний дисплей
    this.externalDisplay = new fabric.Text('1', {
      left: this.size.width / 2,
      top: -30,
      fontSize: 24,
      fill: '#00ff00',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      originX: 'center',
      selectable: false
    });


    
    // Статус
    this.statusText = new fabric.Text('idle', {
      left: this.size.width / 2,
      top: this.size.height + 10,
      fontSize: 14,
      fill: '#00ff00',
      fontFamily: 'Arial',
      originX: 'center',
      selectable: false
    });

    // Создаем группу для лифта
    this.group = new fabric.Group([
      body,
      this.doorLeft,
      this.doorRight,
      this.externalDisplay,
      this.statusText,
      this.floorLabel,
      
    ], {
      left: this.initialX,
      top: this.initialY,
      hasControls: false,
      hasBorders: false,
      selectable: true
    });

    // Кнопка вызова
    this.callButton = new fabric.Polygon([
        { x: 9, y: 0 },    // верхняя точка
        { x: 18, y: 20 },   // правая точка
        { x: 9, y: 40 },   // нижняя точка
        { x: 0, y: 20 }
    ], {
        left: this.initialX + this.size.width + 75,
        top: this.initialY + this.size.height - 60,
        fill: 'rgba(255, 100, 100, 0.9)',
        stroke: '#00ff00',
        strokeWidth: 2,
        originX: 'center',
        originY: 'center',
        hoverCursor: 'pointer',
        evented: true,
        selectable: false,
        hasControls: false,
        hasBorders: false,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
    });
    console.log("Кнопка создана, evented:", this.callButton.evented); // Должно быть true

    // Добавляем элементы на canvas
    this.canvas.add(this.group);
    this.canvas.add(this.callButton);

    // Обработчики событий
    this.callButton.on('mousedown', () => this.handleButtonClick());
    this.group.on('moving', () => this.updateButtonPosition());
  }

  private handleButtonClick() {
    console.log("Кнопка нажата, callButton существует?", !!this.callButton); // Должно быть true
    console.log("Текущее состояние isMoving:", this.isMoving);
    if (!this.callButton || this.isMoving) return;
    if (this.isMoving || this.isAnimating) return;
  
    // Анимация нажатия кнопки
    this.callButton.set('fill', 'rgba(255, 100, 100, 0.9)');
    this.canvas.requestRenderAll();
  
    setTimeout(() => {
      this.callButton.set('fill', 'rgba(255, 0, 0, 0.8)');
      this.canvas.requestRenderAll();
    }, 200);
  
    this.callElevator();
  }

  private updateButtonPosition() {
    if (!this.group || !this.callButton) return;

  const groupLeft = this.group.left || 0;
  const groupTop = this.group.top || 0;
  
  this.callButton.set({
    left: groupLeft + this.size.width + 75,
    top: groupTop + this.size.height - 60,
    perPixelTargetFind: true
  });
  
  this.callButton.setCoords();
  this.canvas.bringToFront(this.callButton);
  this.canvas.requestRenderAll();
}
  
  
private checkAndReattachButtonListener() {
  if (!this.callButton) return;
  
    // Удаляем старый обработчик (если есть)
  this.callButton.off('mousedown');
  
    // Добавляем новый
  this.callButton.on('mousedown', () => this.handleButtonClick());
}

private async callElevator() {
    try {
        this.isMoving = true;
        this.statusText.set('text', 'calling...');
        this.canvas.requestRenderAll();
    
        console.log("Вызов лифта", this.elevatorId);
        const response = await fetch(`http://localhost:3000/api/elevators/${this.elevatorId}/call`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            floor: 2, // Фиксированный этаж для примера, или можно добавить параметр
            elevatorId: this.elevatorId
          }),
        });
    
        if (!response.ok) throw new Error(await response.text());
    
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        this.updateStatusFromServer({
          id: this.elevatorId,
          currentFloor: this.currentFloor,
          targetFloor: 2, // Теперь целевой этаж 2
          status: 'moving',
          doorsOpen: false
        });
    } catch (err) {
        console.error("Ошибка:", err);
    }
}

  private reattachButtonListener() {
    if (!this.callButton) return;
    this.callButton.off('mousedown'); // Удалить старый обработчик
    this.callButton.on('mousedown', () => this.handleButtonClick()); // Добавить новый
  }

  private startStatusUpdates() {
    this.updateStatus();
    this.intervalId = window.setInterval(() => this.updateStatus(), 1000);
  }

  private async updateStatus() {
    try {
      const response = await fetch(
        `http://localhost:3000/api/elevators/${this.elevatorId}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ElevatorStatus = await response.json();
      
      // Всегда обновляем текущий этаж из данных сервера
      this.currentFloor = data.currentFloor;
      this.externalDisplay.set('text', this.currentFloor.toString());
      this.externalDisplay.setCoords(); // Важно для обновления позиции текста
      
      // Обновляем статус
      this.statusText.set('text', data.status);
      this.statusText.setCoords();
      
      // Управление дверями
      if (data.status === 'arrived' && !this.doorsOpen) {
        this.animateDoors(true);
      } else if (data.status !== 'arrived' && this.doorsOpen) {
        this.animateDoors(false);
      }
      this.reattachButtonListener(); // Переподключить кнопку
      this.callButton.bringToFront(); // Поднять на передний план
      this.canvas.requestRenderAll();
      this.updateStatusFromServer(data);
    } catch (err) {
      console.error('Ошибка обновления статуса:', err);
      setTimeout(() => this.updateStatus(), 2000);
    }
  }

  private updateFloor(newFloor: number) {
    if (this.currentFloor !== newFloor) {
      this.currentFloor = newFloor;
      this.externalDisplay.set('text', newFloor.toString());
      this.canvas.requestRenderAll();
    }
  }

  private animateDoors(shouldOpen: boolean) {
    if (this.isAnimating || this.doorsOpen === shouldOpen) return;
    
    this.isAnimating = true;
    this.doorsOpen = shouldOpen;
    // Используем одно и то же значение, как оно было изначально создано (обрати внимание, что при создании дверей использовался doorWidth = this.size.width/2 - 10)
    const targetWidth = shouldOpen ? 0 : (this.size.width / 2 - 10);
    
    let completedAnimations = 0;
    const onAnimationComplete = () => {
      completedAnimations++;
      if (completedAnimations === 2) {
        this.isAnimating = false;
      }
    };
  
    // Анимация левой двери
    fabric.util.animate({
      startValue: this.doorLeft.get('width'),
      endValue: targetWidth,
      duration: 500,
      onChange: (width) => {
        this.doorLeft.set('width', width);
        this.canvas.requestRenderAll();
      },
      onComplete: onAnimationComplete,
      easing: fabric.util.ease.easeInOutCubic
    });
  
    // Анимация правой двери
    fabric.util.animate({
      startValue: this.doorRight.get('width'),
      endValue: targetWidth,
      duration: 500,
      onChange: (width) => {
        this.doorRight.set('width', width);
        this.canvas.requestRenderAll();
      },
      onComplete: onAnimationComplete,
      easing: fabric.util.ease.easeInOutCubic
    });
  }
  


  public setPosition(x: number, y: number) {
    this.group.set({ left: x, top: y });
    this.callButton.set({
      left: x + this.size.width + 5,
      top: y + this.size.height - 40
    });
    this.canvas.requestRenderAll();
  }

  
  public destroy() {
    clearInterval(this.intervalId);
    this.group.off('moving');
    this.callButton.off('mousedown'); // Явное удаление обработчика
  
    // Удаляем элементы с canvas
    this.canvas.remove(this.group);
    this.canvas.remove(this.callButton);
  
    // Очищаем ссылки
    this.group = null as any;
    this.callButton = null as any;
  }
}