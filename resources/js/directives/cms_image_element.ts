import { useImageContextMenuStore } from '@/stores/imageContextMenuStore';
import { saveCmsData } from "@/composables/cms";
import { actionResponse } from '@/types/cmsTypes';

interface CmsElement extends HTMLImageElement {
	__cmsHandler?: EventListener;
	__cmsHandler2?: EventListener;
	__altKeyHandler?: (e: KeyboardEvent) => void;
	__altKeyReleaseHandler?: (e: KeyboardEvent) => void;
	cms_value_path: any;
}

const cms_elements: CmsElement[] = [];

let chosen_element:CmsElement|undefined;

const chose_element = (el:CmsElement) => () => {
	chosen_element = el;
};

export default {
	beforeMount: async (el: CmsElement, binding: any) => {
		if (!binding.value) {
			el.style.border = '2px solid red';
			return;
		}
		el.cms_value_path = binding.value;
		const cmStore = useImageContextMenuStore();

		el.__cmsHandler = cmStore.toggle
		el.addEventListener('contextmenu', cmStore.toggle)
		el.__cmsHandler2 = chose_element(el)
		el.addEventListener('contextmenu', chose_element(el))

		const base = el.style.boxShadow;
		el.__altKeyHandler = (e: KeyboardEvent) => {
			if (e.altKey) el.style.boxShadow = '0 0 6px 2px rgba(255,255,0,0.7)';
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
			el.removeEventListener('contextmenu', el.__cmsHandler);
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
		ref[path[path.length - 1]] = decodedValue(el.src);
	}

	return structure;
}

export async function updatecms_images_values():Promise<actionResponse>{
	const structure = getStructure();
	chosen_element = undefined;
	return saveCmsData(structure);
}


export function getcurrentChosenElement(){
    return chosen_element;
}
