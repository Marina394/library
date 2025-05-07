<template>
    <div class="elevator-container" :style="containerStyle">
      <div class="elevator-id-label">Лифт {{ elevatorId }}<br>Этаж</div>
      <div class="elevator" :style="elevatorStyle">
        <div class="elevator-display">{{ currentFloor }}</div>
        <div class="elevator-doors">
          <div 
            class="door left-door" 
            :style="leftDoorStyle"
          ></div>
          <div 
            class="door right-door" 
            :style="rightDoorStyle"
          ></div>
        </div>
        <div class="elevator-status">{{ status }}</div>
      </div>
      <button 
        class="elevator-button" 
        :style="buttonStyle"
        @click="callElevator"
        :disabled="isMoving || status === 'moving'">
      </button>
    </div>
</template>

<script lang="ts">
import { defineComponent, CSSProperties } from 'vue';

interface ElevatorStatus {
  id: number;
  currentFloor: number;
  targetFloor: number | null;
  status: 'idle' | 'moving' | 'arrived';
  doorsOpen: boolean;
}

interface BuildingStatus {
  buildingFloor: number;
}

export default defineComponent({
  name: 'Elevator',
  props: {
    elevatorId: {
      type: Number,
      required: true
    },
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentFloor: 1,
      status: 'idle' as 'idle' | 'moving' | 'arrived',
      doorsOpen: false,
      isMoving: false,
      intervalId: 0,
      size: { width: 120, height: 200 }
    };
  },
  computed: {
    containerStyle(): CSSProperties {
      return {
        position: 'absolute',
        left: `${this.x}px`,
        top: `${this.y}px`,
        width: `${this.size.width + 100}px`, // Увеличено для таблички
        height: `${this.size.height}px`
      };
    },
    elevatorStyle(): CSSProperties {
      return {
        width: `${this.size.width}px`,
        height: `${this.size.height}px`
      };
    },
    buttonStyle(): CSSProperties {
      return {
        left: `${this.size.width + 5}px`,
        top: `${this.size.height - 40}px`
      };
    },
    leftDoorStyle(): CSSProperties {
      return {
        width: (this.doorsOpen && this.status === 'arrived') ? '0%' : 'calc(50% - 5px)',
        transition: 'width 0.5s ease-in-out'
      };
    },
    rightDoorStyle(): CSSProperties {
      return {
        width: (this.doorsOpen && this.status === 'arrived') ? '0%' : 'calc(50% - 5px)',
        transition: 'width 0.5s ease-in-out'
      };
    }
  },
  mounted() {
    this.startStatusUpdates();
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
  },
  methods: {
    async callElevator() {
      if (this.isMoving) return;
  
      this.isMoving = true;
      this.status = 'calling...';
      
      try {
        const response = await fetch(
          `http://localhost:3000/api/elevators/${this.elevatorId}/call`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ floor: 2 })
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (err) {
        console.error('Ошибка вызова лифта:', err);
      } finally {
        this.isMoving = false;
      }
    },
    startStatusUpdates() {
      this.updateStatus();
      this.intervalId = window.setInterval(() => this.updateStatus(), 1000);
    },
    async updateStatus() {
      try {
        const [elevatorRes, floorRes] = await Promise.all([
          fetch(`http://localhost:3000/api/elevators/${this.elevatorId}`),
          fetch('http://localhost:3000/api/building/floor')
        ]);

        if (!elevatorRes.ok || !floorRes.ok) throw new Error('Ошибка запроса');

        const [elevatorData, floorData] = await Promise.all([
          elevatorRes.json(),
          floorRes.json()
        ]);

        this.currentFloor = floorData.buildingFloor;
        this.status = elevatorData.status;

        if (elevatorData.status === 'arrived' && !this.doorsOpen) {
          this.doorsOpen = true;
        } else if (elevatorData.status !== 'arrived' && this.doorsOpen) {
          this.doorsOpen = false;
        }
      } catch (err) {
        console.error('Ошибка обновления статуса:', err);
        setTimeout(() => this.updateStatus(), 2000);
      }
    }
  }
});
</script>

<style scoped>
.elevator-container {
  position: relative;
}

.elevator-id-label {
  position: absolute;
  left: -70px;
  top: 50%;
  transform: translateY(-50%);
  color: #00ff00;
  font-size: 16px;
  text-align: right;
  width: 60px;
}

.elevator {
  position: relative;
  background-color: rgba(50, 50, 50, 0.95);
  border: 2px solid #00ff00;
  border-radius: 5px;
  overflow: hidden;
}

.elevator-display {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  color: #00ff00;
  font-size: 24px;
  font-weight: bold;
}

.elevator-doors {
  position: absolute;
  top: 10px;
  left: 5px;
  right: 5px;
  bottom: 10px;
  display: flex;
}

.door {
  height: 100%;
  background-color: rgba(70, 70, 70, 0.9);
  border: 1px solid #00ff00;
}

.left-door {
  width: calc(50% - 5px);
  margin-right: 5px;
}

.right-door {
  width: calc(50% - 5px);
  margin-left: 5px;
}

.elevator-status {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  color: #00ff00;
  font-size: 14px;
}

.elevator-button {
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: rgba(255, 0, 0, 0.8);
  border: 1px solid #00ff00;
  color: white;
  cursor: pointer;
  transform: rotate(45deg);
  transition: background-color 0.2s;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

.elevator-button:hover {
  background-color: rgba(255, 100, 100, 0.9);
}

.elevator-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>