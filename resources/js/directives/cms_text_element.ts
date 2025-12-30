import { saveCmsData } from '@/composables/cms';
import { actionResponse } from '@/types/cmsTypes';
import { Directive } from 'vue';
let Quill: any = null;

interface handlerEvent {
    event?: EventListener | ((e: KeyboardEvent) => void);
    event_type: keyof WindowEventMap;
}

interface CmsElement extends HTMLElement {
    __cmsHandlers: handlerEvent[];
    cms_value_path: any;
    quil: any;
}

const cms_elements: CmsElement[] = [];

function removeQuills(els: CmsElement[], elem: CmsElement | null) {
    if (!els) return;

    els.forEach((el) => {
        if (el != elem) {
            removeQuill(el);
        }
    });
}

const MakeEditable = (el: CmsElement) => () => {
    removeQuills(cms_elements, el);
    if (el.quil) return;
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote', 'code-block'],
        ['link', 'image', 'video', 'formula'],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }], // text direction
        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],
        ['clean'], // remove formatting button
    ];

    let q: any = new Quill(el, {
        modules: { toolbar: toolbarOptions },
        theme: 'bubble',
    });
    el.quil = q;
};

function removeQuill(el: CmsElement) {
    if (!el.quil) return;
    el.quil.root.parentElement.querySelector('.ql-toolbar').remove();
    el.quil.root.parentElement.querySelector('.ql-tooltip').remove();
    el.quil.disable();
    el.quil = null;
}



export default function createTextCmsElement(auth:boolean): Directive {
	return {
        mounted: async (el: CmsElement, binding: any) => {
            if(!auth) return;

            if (!binding.value) {
                el.style.border = '2px solid red';
                el.title = 'Brak wartości cms-value!';
                return;
            }
            el.cms_value_path = binding.value;
            el.__cmsHandlers = [];

            if (!Quill && typeof document !== 'undefined') {
                const { default: quill } = await import('quill');
                Quill = quill;
            }

            const handler = MakeEditable(el);
            el.__cmsHandlers.push({ event: handler, event_type: 'click' });
            el.addEventListener('click', handler);

            const base = el.style.boxShadow;
            const showBorder = (e: KeyboardEvent) =>
                e.ctrlKey && (el.style.boxShadow = '0 0 6px 2px rgba(0,255,0,0.7)');
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
	}
}




function decodedValue(value: string) {
    return value.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function getStructure() {
    let structure: any = {};
    for (const el of cms_elements) {
        let ref = structure;
        const path = el.cms_value_path;
        for (let i = 0; i < path.length - 1; i++) {
            if (!ref[path[i]]) ref[path[i]] = {};
            ref = ref[path[i]];
        }
        ref[path[path.length - 1]] = decodedValue(el.innerHTML);
    }
    return structure;
}

export async function updatecms_values(): Promise<actionResponse> {
    removeQuills(cms_elements, null);
    const structure = getStructure();
    return saveCmsData(structure);
}
