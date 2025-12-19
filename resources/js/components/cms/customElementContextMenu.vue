<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ContextMenu from 'primevue/contextmenu';
import { useToast } from 'primevue/usetoast';
import { useDialog } from 'primevue/usedialog';

import ImagesList from './filesList.vue';

import { usecustomElementContextMenuStore } from '@/stores/customElementContextMenuStore';

const cmRef = ref(null);
const cmStore = usecustomElementContextMenuStore();
onMounted(() => {
	cmStore.setRef(cmRef.value);
});

const toast = useToast();
const dialog = useDialog();

const cms_imege_element_contextMenuItems = [
	{
		label: 'Zmień',
        command: () => {
            editCustomCompoenent()
        }
	}
];


import customElementEditValues from './customElementEditValues.vue';
const editCustomCompoenent = () => {
    dialog.open(customElementEditValues, {
        props: {
            header: 'Zmień',
            style: {
                width: '80vw',
                height: '80vh',
            },
            modal: true
        },
    });
}

</script>
<template>
    <ContextMenu ref="cmRef" :model="cms_imege_element_contextMenuItems" />
</template>
