import { createApp } from 'vue'
import App from './App.vue'

// Import the global CSS (Tailwind and custom styles)
import './index.css'

// Register VueCal globally so it can be used in App.vue templates
const app = createApp(App)
app.mount('#app')
