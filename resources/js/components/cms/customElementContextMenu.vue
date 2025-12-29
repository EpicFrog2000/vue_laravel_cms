<script setup lang="ts">
import { useCustomElementContextMenuStore } from '@/stores/ContextMenuStore';
import ContextMenu from 'primevue/contextmenu';
import { useDialog } from 'primevue/usedialog';
import { onMounted, ref } from 'vue';
import customElementEditValues from './customElementEditValues.vue';

const cmRef = ref(null);
const cmStore = useCustomElementContextMenuStore();
onMounted(() => {
    cmStore.setRef(cmRef.value);
});

const dialog = useDialog();

const cms_imege_element_contextMenuItems = [
    {
        label: 'Zmień',
        command: () => {
            editCustomCompoenent();
        },
    },
];

const editCustomCompoenent = () => {
    dialog.open(customElementEditValues, {
        props: {
            header: 'Zmień',
            style: {
                width: 'auto',
                height: '80vh',
            },
            modal: true,
        },
    });
};
</script>
<template>
    <ContextMenu ref="cmRef" :model="cms_imege_element_contextMenuItems" />
</template>
