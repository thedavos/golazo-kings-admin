import { boot } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import { PiniaColada } from '@pinia/colada';
import { useCacheConfig } from 'src/modules/shared/composables/useCacheConfig.composable';

/*
 * When adding new properties to stores, you should also
 * extend the `PiniaCustomProperties` interface.
 * @see https://pinia.vuejs.org/core-concepts/plugins.html#typing-new-store-properties
 */
declare module 'pinia' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface PiniaCustomProperties {
    // add your custom properties here, if any
  }
}

export default boot(({ app }) => {
  const pinia = createPinia();
  const { getCacheStrategy } = useCacheConfig();

  app.use(pinia);
  app.use(PiniaColada, {
    queryOptions: {
      ...getCacheStrategy('moderate'),
    },
  });
});
