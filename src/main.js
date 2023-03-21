import { router } from './router.js';
import Navbar from './navbar.js';

const app = Vue.createApp({
  components: {
    Navbar,
  },
})
app.use(router).mount("#app")