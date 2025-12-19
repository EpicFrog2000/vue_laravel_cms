<script setup lang="ts">
import { onMounted, ref, inject, reactive } from 'vue';
import { getValuesToSet } from '@/directives/cms_custom_element';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { CmsItemValueType, CmsItemValue } from '@/types/cmsTypes';
import ImagesList from './filesList.vue';
const values_to_edit = ref<CmsItemValue[][]>([])

onMounted(() => {
	values_to_edit.value = getValuesToSet() as any
})

const dialogRef = inject<any>('dialogRef')

import { useDialog } from 'primevue/usedialog';
const dialog = useDialog();

const showFiles = (valueObj:any, e:Event) => {
    const targetElement = <HTMLImageElement>e.currentTarget;
    if(!targetElement) return;
    dialog.open(ImagesList, {
        props: {
            header: 'Zmień obraz',
            style: {
                width: '80vw',
                height: '80vh',
            },
            modal: true
        },
        data: {
            choose: true,
        },
        onClose: (options) => {
            if(!options) return;
            const data = options.data;
            if (data) {
                valueObj.value = data.src;
                targetElement.src = data.src;
            }
        }
    });
}

const addElement = () => {
	values_to_edit.value.push(JSON.parse(JSON.stringify(values_to_edit.value[values_to_edit.value.length - 1])))
}


const removeElement = (index:number) => {
    if(values_to_edit.value.length == 1){
        alert('Element musi mieć conajmniej 1 element')
        return;
    }
	values_to_edit.value.splice(index, 1)
}


const changeOrderPrev = (index:number) => {
	if(index <= 0) return
	const a = values_to_edit.value[index - 1]
	values_to_edit.value[index - 1] = values_to_edit.value[index]
	values_to_edit.value[index] = a
}

const changeOrderNext = (index:number) => {
	if(index >= values_to_edit.value.length - 1) return
	const a = values_to_edit.value[index + 1]
	values_to_edit.value[index + 1] = values_to_edit.value[index]
	values_to_edit.value[index] = a
}


</script>


<template>
<div class="h-full flex flex-col gap-4 items-center">
    <br/>
    <div class="flex flex-col gap-4 pb-4">
        Ilośc elementów: {{ values_to_edit.length }}
        <Button label="Dodaj element" class="p-4" @click="addElement" />
    </div>

    <div class="grid grid-cols-1 gap-4">
        <div v-for="(values, index) in values_to_edit" class="flex flex-row justify-between gap-8 p-5 border rounded-md border-graphite">
            <div v-for="(value, index_val) in values" :key="index_val" class="flex flex-col">
                <label class="mb-1 text-gray-300 font-medium">{{ value.type }}</label>
                <InputText v-model="value.value" v-if="value.type != CmsItemValueType.imagePath"/>
                <img @click="showFiles(value, $event)" :src="value.value" :alt="value.value" class="max-h-50 max-w-100 object-cover cursor-pointer" v-else />
            </div>
            <div class="flex flex-col gap-4">
                <Button label="Usuń element" class="p-4" @click="removeElement(index)" />
                <Button label="Daj wcześniej" class="p-4" @click="changeOrderPrev(index)" v-if="index!=0" />
                <Button label="Daj dalej" class="p-4" @click="changeOrderNext(index)" v-if="index!=values_to_edit.length-1"/>
            </div>
        </div>
    </div>

</div>
</template>
