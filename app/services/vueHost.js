// import { createApp } from '../src/js/lib/vue.js'; // or wherever your Vue ESM file lives

// export default  class VueHost {
//   #instance = null;

//   mount(component, selector = '#vue-root') {
//     if (this.#instance) this.#instance.unmount();
//     this.#instance = createApp(component);
//     this.#instance.mount(selector);
//   }

//   unmount() {
//     if (this.#instance) {
//       this.#instance.unmount();
//       this.#instance = null;
//     }
//   }
// }

// src/js/lib/VueHost.js
import { createApp } from '../src/js/lib/vue.js';

export default class VueHost {
  // Use a private field to hold the mounted Vue app instance
  #appInstance = null;

  /**
   * Mounts a new Vue component to the specified selector.
   * Unmounts any existing app instance first.
   * @param {object} component The Vue component to mount.
   * @param {string} selector The CSS selector for the mount point.
   */
  mount(component, selector = '#vue-root') {
    // Unmount the previous instance if one exists
    this.unmount();

    // Create a new Vue application instance
    const app = createApp(component);

    // Mount the new instance and store it
    this.#appInstance = app.mount(selector);
  }

  /**
   * Unmounts the current Vue application instance.
   */
  unmount() {
    if (this.#appInstance) {
      this.#appInstance.unmount();
      this.#appInstance = null;
    }
  }
}
app.singletons['vue'] = new VueHost();