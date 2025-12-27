import '@animxyz/core/dist/animxyz.min.css';
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/vue3';
import Aura from '@primeuix/themes/aura';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import { createApp, h } from 'vue';
const pinia = createPinia();

import cms_custom_element from './directives/cms_custom_element';
import cms_image_element from './directives/cms_image_element';
import cms_link_element from './directives/cms_link_element';
import cms_element from './directives/cms_text_element';
import cms_video_element from './directives/cms_video_element';

import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.core.css';

import DialogService from 'primevue/dialogservice';
import ToastService from 'primevue/toastservice';

createInertiaApp({
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
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(PrimeVue, {
                theme: {
                    preset: Aura,
                },
            })
            .use(pinia)
            .directive('cms-text-element', cms_element)
            .directive('cms-image-element', cms_image_element)
            .directive('cms-link-element', cms_link_element)
            .directive('cms-custom-element', cms_custom_element)
            .directive('cms-video-element', cms_video_element)
            .use(ToastService)
            .use(DialogService)
            .mount(el);
    },
});
