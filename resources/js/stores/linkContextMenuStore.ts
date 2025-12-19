import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLinkContextMenuStore = defineStore('linkContextMenu', {
	state: () => ({
		menuRef: ref()
	}),
	actions: {
		setRef(refValue: any) {
			this.menuRef = refValue;
		},
		toggle(event: any) {
			this.menuRef.show(event)
		},
	}
});