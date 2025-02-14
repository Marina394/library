export class ValueTumblerShape {
    value: number;
    min: number;
    max: number;
    step: number;
  
    constructor(min: number = 0, max: number = 100, step: number = 1) {
      this.min = min;
      this.max = max;
      this.step = step;
      this.value = (min + max) / 2;
    }
  
    increase(): number {
      this.value = Math.min(this.value + this.step, this.max);
      return this.value;
    }
  
    decrease(): number {
      this.value = Math.max(this.value - this.step, this.min);
      return this.value;
    }
  }
  