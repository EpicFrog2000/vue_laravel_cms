<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ContextMenu from 'primevue/contextmenu';
import { useToast } from 'primevue/usetoast';
import { getcurrentChosenElement } from '@/directives/cms_image_element';
import { useDialog } from 'primevue/usedialog';
import { useImageContextMenuStore } from '@/stores/imageContextMenuStore';
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
            showFiles()
        }
	}
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
            if(!options) return;
            const data = options.data;
            if (data) {
                const new_src = data.src;
                const element = getcurrentChosenElement();
                if(!element){
                    toast.add({severity:'info',summary:'Info',detail:'Nie wybrano elementów', life:3000});
                    return;
                }
                element.src = new_src;
                toast.add({severity:'info',summary:'Info',detail:'Zmieniono', life:3000});
            }
        }
    });
}

</script>
<template>

    <ContextMenu ref="cmRef" :model="cms_imege_element_contextMenuItems" />

</template>
