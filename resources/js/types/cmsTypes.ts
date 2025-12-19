export enum CmsItemValueType {
	text = 'text',
	imagePath = 'imagePath'
}

export interface CmsItemValue {
	name: string
	type: CmsItemValueType
	value: string
}

export interface CmsLink{
	href: string,
	link_text: string,
	target: string,
}
export const defaultLinkValues: CmsLink = {
	href: '',
	link_text: '',
	target: '_self'
}


export interface PageSettings {
    title: string,
    description: string,
	cos_innego: string
}
export const defaultPageSettings: PageSettings = {
	title: '',
	description: '',
	cos_innego: ''
}

export interface actionResponse {
    status_ok:boolean;
    message: string;
    data: any;
}
