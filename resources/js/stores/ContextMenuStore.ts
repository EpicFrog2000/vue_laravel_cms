import { defineStore } from 'pinia';
import { ref } from 'vue';

export const createContextMenuStore = (id: string) =>
    defineStore(id, {
        state: () => ({
            menuRef: ref<any>(),
        }),
        actions: {
            setRef(v: any) {
                this.menuRef = v;
            },
            toggle(e: any) {
                this.menuRef?.show(e);
            },
        },
    });

export const useImageContextMenuStore =
    createContextMenuStore('imageContextMenu');
export const useLinkContextMenuStore =
    createContextMenuStore('linkContextMenu');
export const useVideoContextMenuStore =
    createContextMenuStore('videoContextMenu');
export const useCustomElementContextMenuStore = createContextMenuStore(
    'customElementContextMenu',
);
