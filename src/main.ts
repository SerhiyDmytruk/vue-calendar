import { createApp } from 'vue'
import App from './App.vue'

// Import VueCal and its CSS globally
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

// Import the global CSS (Tailwind and custom styles)
import './index.css'

// Register VueCal globally so it can be used in App.vue templates
const app = createApp(App)
app.component('vue-cal', VueCal)
app.mount('#app')
