<script setup lang="ts">
import ContextMenu from 'primevue/contextmenu';
import { updatecms_values } from '@/directives/cms_text_element';
import { updatecms_images_values } from '@/directives/cms_image_element';
import { updatecms_link_values } from '@/directives/cms_link_element';
import { updatecms_custom_element_values } from '@/directives/cms_custom_element';
import { updatecms_video_values } from '@/directives/cms_video_element';
import ImagesList from './filesList.vue';
import { useDialog } from 'primevue/usedialog';
import { useToast } from 'primevue/usetoast';
const toast = useToast();
const dialog = useDialog();

const manageFiles = () => {
    dialog.open(ImagesList, {
        props: {
            header: 'Zarządzanie plikami',
            style: {
                width: '80vw',
                height: '80vh',
            },
            modal: true,
        },
        data: {
            choose: false,
        },
    });
}

import pagesList from './pagesList.vue';

const listStrony = () => {
    dialog.open(pagesList, {
        props: {
            header: 'Strony',
            style: {
                width: 'auto',
                height: 'auto',
            },
            modal: true,
        },
        data: {
            choose: false,
        },
    });
}



const globalMenuItems = [
    {
        label: 'Strony',
        command: () => {
            listStrony()
        }
    },
	{
		label: 'Zarządzaj plikami',
        command: () => {
            manageFiles()
        }
	},
    {
		label: 'Zapisz',
        command: async () => {
            const actions = [
                {fn: updatecms_values, msg: 'Zapisano teksty'},
                {fn: updatecms_images_values, msg: 'Zapisano obrazy'},
                {fn: updatecms_link_values, msg: 'Zapisano linki'},
                {fn: updatecms_custom_element_values, msg: 'Zapisano elementy'},
                {fn: updatecms_video_values, msg: 'Zapisano video'},
            ]

            for(const {fn, msg} of actions){
                const res = await fn()
                toast.add({
                    severity: res.status_ok ? 'info' : 'error',
                    summary: res.status_ok ? 'Info' : 'Error',
                    detail: res.status_ok ? msg : `Error: ${res.message}`,
                    life: 3000
                })
            }
        }
	}
];

</script>
<template>
    <ContextMenu global :model="globalMenuItems"/>
</template>
