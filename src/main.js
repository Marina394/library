import './assets/styles/tailwind.css';

import {createApp} from 'vue'
import App from './App.vue'
import {globalVariableStore} from './store';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


import UIComponents from './components/ui';

const app = createApp(App)

app.use(ElementPlus);
app.use(globalVariableStore);
app.use(UIComponents);

app.mount('#app')



