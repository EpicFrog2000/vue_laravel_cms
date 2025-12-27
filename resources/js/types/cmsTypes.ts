export enum CmsItemValueType {
    text = 'text',
    imagePath = 'imagePath',
}

export interface CmsItemValue {
    name: string;
    type: CmsItemValueType;
    value: string;
}

export interface CmsLink {
    href: string;
    link_text: string;
    target: string;
}
export const defaultLinkValues: CmsLink = {
    href: '',
    link_text: '',
    target: '_self',
};

export interface CmsVideo {
    video_path: string;
    autoplay: boolean;
    muted: boolean;
    loop: boolean;
    controls: boolean;
    poster: string;
    preload: 'auto' | 'metadata' | 'none';
}
export const defaultVideoValues: CmsVideo = {
    video_path: '',
    autoplay: true,
    muted: true,
    loop: true,
    controls: false,
    poster: '',
    preload: 'auto',
};

export interface PageSettings {
    title: string;
    description: string;
    cos_innego: string;
}
export const defaultPageSettings: PageSettings = {
    title: '',
    description: '',
    cos_innego: '',
};

export interface actionResponse {
    status_ok: boolean;
    message: string;
    data: any;
}
