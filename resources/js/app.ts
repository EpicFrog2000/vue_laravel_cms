import '@animxyz/core/dist/animxyz.min.css';
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/vue3';
import Aura from '@primeuix/themes/aura';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import { createApp, h } from 'vue';
const pinia = createPinia();

import createCustomCmsElement from './directives/cms_custom_element';
import createImageCmsElement from './directives/cms_image_element';
import createLinkCmsElement from './directives/cms_link_element';
import createTextCmsElement from './directives/cms_text_element';
import createVideoCmsElement from './directives/cms_video_element';

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
        const app = createApp({ render: () => h(App, props) })
        const auth:boolean = <boolean>props.initialPage.props.auth;
        app
            .use(plugin)
            .use(PrimeVue, { theme: { preset: Aura } })
            .use(pinia)
            .directive('cms-text-element', createTextCmsElement(auth))
            .directive('cms-image-element', createImageCmsElement(auth))
            .directive('cms-link-element', createLinkCmsElement(auth))
            .directive('cms-custom-element', createCustomCmsElement(auth))
            .directive('cms-video-element', createVideoCmsElement(auth))
            .use(ToastService)
            .use(DialogService)
            .mount(el)
    }
});
