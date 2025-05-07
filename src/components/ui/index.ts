import { App } from 'vue';
import Switch from './Switch.vue';

export default {
  install(app: App) {
    app.component('Switch', Switch);
  }
};

export { Switch };
