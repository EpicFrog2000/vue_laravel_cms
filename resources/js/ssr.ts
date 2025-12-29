import '../css/app.css';

import { createInertiaApp } from '@inertiajs/vue3';
import createServer from '@inertiajs/vue3/server';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';

import Aura from '@primeuix/themes/aura';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
const pinia = createPinia();

import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.core.css';
import cms_custom_element from './directives/cms_custom_element';
import cms_image_element from './directives/cms_image_element';
import cms_link_element from './directives/cms_link_element';
import cms_text_element from './directives/cms_text_element';

import DialogService from 'primevue/dialogservice';
import ToastService from 'primevue/toastservice';

createServer(
    (page) =>
        createInertiaApp({
            page,
            render: renderToString,
            title: (title) => title,
            resolve: (name) => {
                const pages = import.meta.glob('./pages/**/*.vue');
                const importer = pages[`./pages/${name}.vue`];
                if (!importer) throw new Error(`Page not found: ${name}`);
                return importer().then((module: any) => {
                    const comp = module.default ?? module;
                    return comp;
                });
            },
            setup: ({ App, props, plugin }) =>
                createSSRApp({ render: () => h(App, props) })
                    .use(plugin)
                    .use(PrimeVue, {
                        theme: {
                            preset: Aura,
                        },
                    })
                    .directive('cms-text-element', cms_text_element)
                    .directive('cms-image-element', cms_image_element)
                    .directive('cms-link-element', cms_link_element)
                    .directive('cms-custom-element', cms_custom_element)
                    .use(ToastService)
                    .use(DialogService)
                    .use(pinia),
        }),
    { cluster: true },
);
