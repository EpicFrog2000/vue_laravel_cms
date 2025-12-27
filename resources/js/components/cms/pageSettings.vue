<script setup lang="ts">
import { getPageSettings, savePageSettings } from '@/composables/cms';
import { PageSettings, defaultPageSettings } from '@/types/cmsTypes';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { useToast } from 'primevue/usetoast';
import { inject, onMounted, ref } from 'vue';

const toast = useToast();

const pageSettings = ref<PageSettings>({ ...defaultPageSettings });
const dialogRef = inject<any>('dialogRef');
const slug = ref('');

onMounted(async () => {
    slug.value = dialogRef?.value?.data?.slug;
    const res = await getPageSettings(slug.value);
    pageSettings.value = res.data;
    if (!res.status_ok) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: res.message,
            life: 3000,
        });
    }
});

const saveSettings = async () => {
    const res = await savePageSettings(slug.value, pageSettings.value);
    if (res.status_ok) {
        toast.add({
            severity: 'info',
            summary: 'Info',
            detail: res.message,
            life: 3000,
        });
    } else {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: res.message,
            life: 3000,
        });
    }
};
</script>

<template>
    <div class="flex h-full w-full flex-col gap-4 overflow-y-auto">
        <div v-for="(value, key) in pageSettings" :key="key">
            {{ key }}
            <InputText v-model="pageSettings[key]" class="w-full" />
        </div>
        <Button label="zapisz" @click="saveSettings" />
    </div>
</template>
