<script setup lang="ts">
import { getcurrentChosenElement } from '@/directives/cms_video_element';
import { useVideoContextMenuStore } from '@/stores/ContextMenuStore';
import { CmsVideo, defaultVideoValues } from '@/types/cmsTypes';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import ContextMenu from 'primevue/contextmenu';
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';
import { useDialog } from 'primevue/usedialog';
import { onMounted, ref } from 'vue';
import filesList from './filesList.vue';

const video_element_values = ref<CmsVideo>(defaultVideoValues);

const cmStore = useVideoContextMenuStore();
const cmRef = ref(null);

const chosen_element = ref<any>(null);
const visible = ref(false);

function loadElementData() {
    const element = getcurrentChosenElement();
    chosen_element.value = element;

    video_element_values.value = {
        ...defaultVideoValues,
        ...(element
            ? {
                  video_path: element.src || defaultVideoValues.video_path,
                  autoplay: element.autoplay ?? defaultVideoValues.autoplay,
                  muted: element.muted ?? defaultVideoValues.muted,
                  loop: element.loop ?? defaultVideoValues.loop,
                  controls: element.controls ?? defaultVideoValues.controls,
                  poster:
                      element.getAttribute('poster') ||
                      defaultVideoValues.poster,
                  preload:
                      (element.getAttribute('preload') as
                          | 'auto'
                          | 'metadata'
                          | 'none') || defaultVideoValues.preload,
              }
            : {}),
    };
}

const cms_video_element_contextMenuItems = [
    {
        label: 'Zmień video',
        command: () => {
            loadElementData();
            visible.value = true;
        },
    },
];

onMounted(() => {
    cmStore.setRef(cmRef.value);
});

function updateVideo() {
    if (chosen_element.value) {
        const values = {
            ...defaultVideoValues,
            ...video_element_values.value,
        };

        chosen_element.value.src = values.video_path;
        chosen_element.value.autoplay = values.autoplay;
        chosen_element.value.muted = values.muted;
        chosen_element.value.loop = values.loop;
        chosen_element.value.controls = values.controls;

        if (values.poster) {
            chosen_element.value.setAttribute('poster', values.poster);
        } else {
            chosen_element.value.removeAttribute('poster');
        }

        if (values.preload) {
            chosen_element.value.setAttribute('preload', values.preload);
        } else {
            chosen_element.value.removeAttribute('preload');
        }

        visible.value = false;
    }
}

const dialog = useDialog();

const showFiles = (e: Event) => {
    const targetElement = <HTMLImageElement>e.currentTarget;
    if (!targetElement) return;
    dialog.open(filesList, {
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
                video_element_values.value.poster = data.src;
            }
        },
    });
};

const showFilesV = (e: Event) => {
    const targetElement = <HTMLImageElement>e.currentTarget;
    if (!targetElement) return;
    dialog.open(filesList, {
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
                video_element_values.value.video_path = data.src;
            }
        },
    });
};

const videoError = ref(true);
</script>
<template>
    <ContextMenu ref="cmRef" :model="cms_video_element_contextMenuItems" />

    <Dialog v-model:visible="visible" modal header="Zmiana wideo">
        <div class="flex flex-col gap-4">
            <div
                class="flex cursor-pointer items-center gap-4"
                @click="showFilesV"
            >
                <label for="input-video-path" class="w-24 font-semibold"
                    >Video path</label
                >
                <video
                    v-if="video_element_values.video_path && !videoError"
                    @error="videoError = true"
                    :src="video_element_values.video_path"
                    :poster="video_element_values.poster"
                    class="max-w-100"
                ></video>
                <div v-else>Brak video</div>
            </div>
            <div class="flex items-center gap-4">
                <label for="input-autoplay" class="w-24 font-semibold"
                    >Autoplay</label
                >
                <Checkbox
                    binary
                    id="input-autoplay"
                    v-model="video_element_values.autoplay"
                />
            </div>
            <div class="flex items-center gap-4">
                <label for="input-muted" class="w-24 font-semibold"
                    >Muted</label
                >
                <Checkbox
                    binary
                    id="input-muted"
                    v-model="video_element_values.muted"
                />
            </div>
            <div class="flex items-center gap-4">
                <label for="input-loop" class="w-24 font-semibold">Loop</label>
                <Checkbox
                    binary
                    id="input-loop"
                    v-model="video_element_values.loop"
                />
            </div>
            <div class="flex items-center gap-4">
                <label for="input-controls" class="w-24 font-semibold"
                    >Controls</label
                >
                <Checkbox
                    binary
                    id="input-controls"
                    v-model="video_element_values.controls"
                />
            </div>
            <div
                class="flex cursor-pointer items-center gap-4"
                @click="showFiles"
            >
                <label for="input-poster" class="w-24 font-semibold"
                    >Poster</label
                >
                <img
                    :src="video_element_values.poster"
                    alt="poster"
                    class="max-w-100"
                />
            </div>
            <div class="flex items-center gap-4">
                <label for="input-preload" class="w-24 font-semibold"
                    >Preload</label
                >
                <Select
                    id="input-preload"
                    class="flex-auto"
                    :options="['auto', 'metadata', 'none']"
                    v-model="video_element_values.preload"
                />
            </div>

            <div class="flex justify-end gap-2">
                <Button
                    type="button"
                    label="Cancel"
                    severity="secondary"
                    @click="visible = false"
                />
                <Button type="button" label="Save" @click="updateVideo" />
            </div>
        </div>
    </Dialog>
</template>
