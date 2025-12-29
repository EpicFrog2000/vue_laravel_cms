<script setup lang="ts">
import { getcurrentChosenElement } from '@/directives/cms_image_element';
import { useImageContextMenuStore } from '@/stores/ContextMenuStore';
import ContextMenu from 'primevue/contextmenu';
import { useDialog } from 'primevue/usedialog';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import ImagesList from './filesList.vue';

const cmRef = ref(null);
const cmStore = useImageContextMenuStore();
onMounted(() => {
    cmStore.setRef(cmRef.value);
});

const toast = useToast();
const dialog = useDialog();

const cms_imege_element_contextMenuItems = [
    {
        label: 'Zmień obraz',
        command: () => {
            showFiles();
        },
    },
];

const showFiles = () => {
    dialog.open(ImagesList, {
        props: {
            header: 'Zmień obraz',
            style: {
                width: '80vw',
                height: '80vh',
            },
            modal: true,
        },
        data: {
            choose: true,
        },
        onClose: (options) => {
            if (!options) return;
            const data = options.data;
            if (data) {
                const new_src = data.src;
                const element = getcurrentChosenElement();
                if (!element) {
                    toast.add({
                        severity: 'info',
                        summary: 'Info',
                        detail: 'Nie wybrano elementów',
                        life: 3000,
                    });
                    return;
                }
                element.src = new_src;
            }
        },
    });
};
</script>
<template>
    <ContextMenu ref="cmRef" :model="cms_imege_element_contextMenuItems" />
</template>
