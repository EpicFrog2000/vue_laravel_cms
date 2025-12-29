<script setup lang="ts">
import { getcurrentChosenElement } from '@/directives/cms_link_element';
import { useLinkContextMenuStore } from '@/stores/ContextMenuStore';
import { CmsLink, defaultLinkValues } from '@/types/cmsTypes';
import Button from 'primevue/button';
import ContextMenu from 'primevue/contextmenu';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import { onMounted, ref } from 'vue';

const link_element_values = ref<CmsLink>(defaultLinkValues);

const cmStore = useLinkContextMenuStore();
const cmRef = ref(null);
const chosen_element = ref<any>(null);
const visible = ref(false);

function loadElementData() {
    const element = getcurrentChosenElement();
    chosen_element.value = element;

    link_element_values.value = {
        ...defaultLinkValues,
        ...(element
            ? {
                  href: element.href || defaultLinkValues.href,
                  target:
                      element.getAttribute('target') ||
                      defaultLinkValues.target,
                  link_text: element.innerHTML || defaultLinkValues.link_text,
              }
            : {}),
    };
}

const cms_link_element_contextMenuItems = [
    {
        label: 'Zmień link',
        command: () => {
            loadElementData();
            visible.value = true;
        },
    },
];

onMounted(() => {
    cmStore.setRef(cmRef.value);
});

function updateLink() {
    if (chosen_element.value) {
        const values = {
            ...defaultLinkValues,
            ...link_element_values.value,
        };

        chosen_element.value.href = values.href;
        if (values.target) {
            chosen_element.value.setAttribute('target', values.target);
        } else {
            chosen_element.value.removeAttribute('target');
        }
        chosen_element.value.innerHTML = values.link_text;
        visible.value = false;
    }
}
</script>
<template>
    <ContextMenu ref="cmRef" :model="cms_link_element_contextMenuItems" />

    <Dialog v-model:visible="visible" modal header="Zmiana linku">
        <div class="flex flex-col gap-4">
            <div class="flex items-center gap-4">
                <label for="input-href" class="w-24 font-semibold">Href</label>
                <InputText
                    id="input-href"
                    class="flex-auto"
                    autocomplete="off"
                    v-model="link_element_values.href"
                />
            </div>
            <div class="flex items-center gap-4">
                <label for="input-text" class="w-24 font-semibold"
                    >Link text</label
                >
                <InputText
                    id="input-text"
                    class="flex-auto"
                    autocomplete="off"
                    v-model="link_element_values.link_text"
                />
            </div>
            <div class="flex items-center gap-4">
                <label for="input-target" class="w-24 font-semibold"
                    >Target</label
                >
                <Select
                    id="input-target"
                    class="flex-auto"
                    :options="['_self', '_blank', '_parent', '_top']"
                    v-model="link_element_values.target"
                />
            </div>

            <div class="flex justify-end gap-2">
                <Button
                    type="button"
                    label="Cancel"
                    severity="secondary"
                    @click="visible = false"
                />
                <Button type="button" label="Save" @click="updateLink" />
            </div>
        </div>
    </Dialog>
</template>
