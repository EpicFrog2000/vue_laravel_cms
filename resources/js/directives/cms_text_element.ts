import { saveCmsData } from "@/composables/cms";
import { actionResponse } from '@/types/cmsTypes';

let Quill:any = null;

interface CmsElement extends HTMLElement {
	__cmsHandler?: EventListener;
	__altKeyHandler?: (e: KeyboardEvent) => void;
	__altKeyReleaseHandler?: (e: KeyboardEvent) => void;
	cms_value_path: any;
	quil: any;
}

const cms_elements: CmsElement[] = [];

function removeQuills(els: CmsElement[], elem: CmsElement|null) {
	if (!els) return;

	els.forEach(el => {
		if(el != elem){
			removeQuill(el)
		}
	});

}

const MakeEditable = (el:CmsElement) => () => {
	removeQuills(cms_elements, el);
	if(el.quil) return;
	const toolbarOptions = [
		['bold', 'italic', 'underline', 'strike'],        // toggled buttons
		['blockquote', 'code-block'],
		['link', 'image', 'video', 'formula'],
		[{ 'header': 1 }, { 'header': 2 }],               // custom button values
		[{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
		[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
		[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
		[{ 'direction': 'rtl' }],                         // text direction
		[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
		[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
		[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
		[{ 'font': [] }],
		[{ 'align': [] }],
		['clean']                                         // remove formatting button
	];

	let q:any = new Quill(el, {
		modules:{toolbar:toolbarOptions},
		theme:'bubble',

	})
	el.quil = q;
};

function removeQuill(el: CmsElement) {
	if (!el.quil) return
	el.quil.root.parentElement.querySelector('.ql-toolbar').remove()
	el.quil.root.parentElement.querySelector('.ql-tooltip').remove()
	el.quil.disable()
	el.quil = null
}


export default {
	beforeMount: async (el: CmsElement, binding: any) => {
		if (!binding.value) {
			el.style.border = '2px solid red';
			el.title = 'Brak wartości cms-value!';
			return;
		}
		el.cms_value_path = binding.value;

		if (!Quill && typeof document !== 'undefined') {
			const { default: quill } = await import('quill')
			Quill = quill
		}

		const handler = MakeEditable(el)
		el.__cmsHandler = handler
		el.addEventListener('click', handler)

		const base = el.style.boxShadow;
		el.__altKeyHandler = (e: KeyboardEvent) => {
			if (e.altKey) el.style.boxShadow = '0 0 6px 2px rgba(0,255,0,0.7)';
		}
		el.__altKeyReleaseHandler = (e: KeyboardEvent) => {
			if (!e.altKey) el.style.boxShadow = base;
		}
		window.addEventListener('keydown', el.__altKeyHandler)
		window.addEventListener('keyup', el.__altKeyReleaseHandler)
		cms_elements.push(el)
	},
	beforeUnmount(el: CmsElement) {
		const index = cms_elements.indexOf(el);
		if (index !== -1) cms_elements.splice(index, 1);
		if (el.__cmsHandler) {
			el.removeEventListener('click', el.__cmsHandler);
			delete el.__cmsHandler;
		}

		if (el.__altKeyHandler) {
			window.removeEventListener('keydown', el.__altKeyHandler);
			delete el.__altKeyHandler;
		}
		if (el.__altKeyReleaseHandler) {
			window.removeEventListener('keyup', el.__altKeyReleaseHandler);
			delete el.__altKeyReleaseHandler;
		}
	}
};

function decodedValue(value:string){
	return value.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function getStructure(){
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

export async function updatecms_values():Promise<actionResponse>{
	removeQuills(cms_elements, null);
	const structure = getStructure();
	return saveCmsData(structure);
}
