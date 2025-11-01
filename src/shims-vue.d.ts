import { ComponentCustomProperties } from 'vue';
import { Pinia } from 'pinia';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $pinia: Pinia;
  }
}

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/*' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
