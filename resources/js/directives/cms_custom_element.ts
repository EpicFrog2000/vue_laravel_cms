import { saveCmsData } from '@/composables/cms';
import { useCustomElementContextMenuStore } from '@/stores/ContextMenuStore';
import { actionResponse, CmsItemValue } from '@/types/cmsTypes';

interface handlerEvent {
    event?: EventListener | ((e: KeyboardEvent) => void);
    event_type: keyof WindowEventMap;
}

interface CmsElement extends HTMLElement {
    __cmsHandlers: handlerEvent[];
    cms_value_path: any;
    cms_values: CmsItemValue[][];
}

const cms_elements: CmsElement[] = [];

let chosen_element: CmsElement | undefined;

const chose_element = (el: CmsElement) => () => {
    chosen_element = el;
};

export default {
    beforeMount: async (el: CmsElement, binding: any) => {
        if (!binding.value) {
            el.style.outline = '2px solid red';
            return;
        }
        el.__cmsHandlers = [];
        el.cms_value_path = binding.value;
        el.cms_values = binding.arg;
        const cmStore = useCustomElementContextMenuStore();
        const contextHandler1 = cmStore.toggle;
        const contextHandler2 = chose_element(el);

        el.__cmsHandlers.push({
            event: contextHandler1,
            event_type: 'contextmenu',
        });
        el.addEventListener('contextmenu', contextHandler1);

        el.__cmsHandlers.push({
            event: contextHandler2,
            event_type: 'contextmenu',
        });
        el.addEventListener('contextmenu', contextHandler2);

        const base = el.style.boxShadow;
        const showBorder = (e: KeyboardEvent) =>
            e.altKey &&
            (el.style.boxShadow = '0 0 6px 2px rgba(0,255,255,0.7)');
        const hideBorder = () => (el.style.boxShadow = base);

        el.__cmsHandlers.push({ event: showBorder, event_type: 'keydown' });
        el.__cmsHandlers.push({ event: hideBorder, event_type: 'keyup' });

        window.addEventListener('keydown', showBorder);
        window.addEventListener('keyup', hideBorder);

        cms_elements.push(el);
    },
    beforeUnmount(el: CmsElement) {
        for (const h of el.__cmsHandlers) {
            window.removeEventListener(h.event_type, h.event as any);
        }
        el.__cmsHandlers = [];
        const i = cms_elements.indexOf(el);
        if (i !== -1) cms_elements.splice(i, 1);
    },
};

function decodedValue(value: string) {
    return value.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

export function getValuesToSet() {
    if (!chosen_element) return [];
    return chosen_element.cms_values;
}

export function set_new_values(values: CmsItemValue[][]) {
    if (!chosen_element) return;
    chosen_element.cms_values = values;
    console.log(chosen_element.cms_values);
}

export function getStructure() {
    if (!chosen_element) return;
    let structure: any = {};
    for (const el of cms_elements) {
        let ref = structure;
        const path = el.cms_value_path;

        for (let i = 0; i < path.length - 1; i++) {
            if (!ref[path[i]]) ref[path[i]] = {};
            ref = ref[path[i]];
        }

        const finalKey = path[path.length - 1];

        if (!ref[finalKey]) {
            ref[finalKey] = {};
        }

        ref[finalKey] = el.cms_values;
    }
    return structure;
}

export async function updatecms_custom_element_values(): Promise<actionResponse> {
    const structure = getStructure();
    chosen_element = undefined;
    return saveCmsData(structure);
}

export function getcurrentChosenElement() {
    return chosen_element;
}
