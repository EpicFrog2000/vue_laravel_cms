<script setup lang="ts">
import {
    getValuesToSet,
    set_new_values,
} from '@/directives/cms_custom_element';
import { CmsItemValue, CmsItemValueType } from '@/types/cmsTypes';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { useDialog } from 'primevue/usedialog';
import { onMounted, ref } from 'vue';
import ImagesList from './filesList.vue';

const values_to_edit = ref<CmsItemValue[][]>([]);

onMounted(() => {
    values_to_edit.value = getValuesToSet() as any;
});

const dialog = useDialog();

const showFiles = (valueObj: any, e: Event) => {
    const targetElement = <HTMLImageElement>e.currentTarget;
    if (!targetElement) return;
    dialog.open(ImagesList, {
        props: {
            header: 'Zmień obraz',
            style: {
                width: 'auto',
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
                valueObj.value = data.src;
                targetElement.src = data.src;
            }
        },
    });
};

const addElement = () => {
    values_to_edit.value.push(
        JSON.parse(
            JSON.stringify(
                values_to_edit.value[values_to_edit.value.length - 1],
            ),
        ),
    );
    set_new_values(values_to_edit.value);
};

const removeElement = (index: number) => {
    if (values_to_edit.value.length == 1) {
        alert('Element musi mieć conajmniej 1 element');
        return;
    }
    values_to_edit.value.splice(index, 1);
    set_new_values(values_to_edit.value);
};

const changeOrderPrev = (index: number) => {
    if (index <= 0) return;
    const a = values_to_edit.value[index - 1];
    values_to_edit.value[index - 1] = values_to_edit.value[index];
    values_to_edit.value[index] = a;
    set_new_values(values_to_edit.value);
};

const changeOrderNext = (index: number) => {
    if (index >= values_to_edit.value.length - 1) return;
    const a = values_to_edit.value[index + 1];
    values_to_edit.value[index + 1] = values_to_edit.value[index];
    values_to_edit.value[index] = a;
    set_new_values(values_to_edit.value);
};
</script>

<template>
    <div class="flex h-full flex-col items-center gap-4">
        <br />
        <div class="flex flex-col gap-4 pb-4">
            Ilośc elementów: {{ values_to_edit.length }}
            <Button label="Dodaj element" class="p-4" @click="addElement" />
        </div>

        <div class="grid grid-cols-1 gap-4">
            <div
                v-for="(values, index) in values_to_edit"
                class="border-graphite flex flex-row justify-between gap-8 rounded-md border p-5"
            >
                <div
                    v-for="(value, index_val) in values"
                    :key="index_val"
                    class="flex flex-col"
                >
                    <label class="mb-1 font-medium text-gray-300">{{
                        value.type
                    }}</label>
                    <InputText
                        v-model="value.value"
                        v-if="value.type != CmsItemValueType.imagePath"
                    />
                    <img
                        @click="showFiles(value, $event)"
                        :src="value.value"
                        :alt="value.value"
                        class="max-h-50 max-w-100 cursor-pointer object-cover"
                        v-else
                    />
                </div>
                <div class="flex flex-col gap-4">
                    <Button
                        label="Usuń element"
                        class="p-4"
                        @click="removeElement(index)"
                    />
                    <Button
                        label="Daj wcześniej"
                        class="p-4"
                        @click="changeOrderPrev(index)"
                        v-if="index != 0"
                    />
                    <Button
                        label="Daj dalej"
                        class="p-4"
                        @click="changeOrderNext(index)"
                        v-if="index != values_to_edit.length - 1"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
