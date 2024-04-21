import './assets/main.css'

import { createApp } from 'vue'
import { Button, Form, Input, InputNumber, Modal, Table } from 'ant-design-vue'
import App from './App.vue'

createApp(App)
  .use(Table)
  .use(Button)
  .use(Modal)
  .use(Input)
  .use(Form)
  .use(InputNumber)
  .mount('#app')
