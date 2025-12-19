<script setup lang="ts">
import { ref, onMounted, inject, computed } from "vue"
import DataView from "primevue/dataview"
import { getFiles } from "@/composables/cms"
import ContextMenu from "primevue/contextmenu"
import { useToast } from 'primevue/usetoast';
import FileUpload from 'primevue/fileupload';
import { uploadImages } from "@/composables/cms";
import InputText from "primevue/inputtext";

const imagesList = ref<string[]>([])
const dialogRef = inject<any>('dialogRef')
const toast = useToast();
const menu = ref();
const chosen_elem = ref<HTMLImageElement>();
const filterText = ref('');


onMounted(async()=>{
    const res = await getFiles();
    imagesList.value = res.data;
    if(!res.status_ok){
		toast.add({severity:"error",summary:"Error",detail:res.message,life:3000})
	}
})

const closeDialog = (src: string) => {
	if (dialogRef.value.choose == false) return;
	dialogRef?.value?.close({ src })
}

const filteredImages = computed(() => {
	if (!filterText.value) {
		return imagesList.value;
	}
	const filterLower = filterText.value.toLowerCase();
	return imagesList.value.filter(item => item.toLowerCase().includes(filterLower));
});


const onImageRightClick = (event: MouseEvent) => {
    if(!event.target) return;
    chosen_elem.value = <HTMLImageElement>event.target;
    menu.value.show(event);
};

const image_menu_items = [
    {
        label: 'Kopiuj link',
        command: () => {
            if(chosen_elem.value && chosen_elem.value.src){
                try{
                    navigator.clipboard.writeText(chosen_elem.value.src);
                }catch{
                    throw new Error("działa tylko na https")
                }
                toast.add({severity:'info',summary:'Info',detail:'Skopiowano link do pliku',life:3000});
            }else{
                toast.add({severity:'info',summary:'Info',detail:'Błąd, nie skopiowano linku',life:3000});
            }
        }
    }
];

const upload = async (event:any)=>{
	const res=await uploadImages(event.files)
	if(!res.status_ok){
		toast.add({severity:"error",summary:"Error",detail:res.message,life:3000})
		return
	}

	toast.add({severity:"info",summary:"Sukces",detail:"Dodano plik",life:3000})
    const resImages = await getFiles();
    imagesList.value = resImages.data;
    if(!resImages.status_ok){
		toast.add({severity:"error",summary:"Error",detail:resImages.message,life:3000})
		return
	}
}

</script>

<template>
    <div class="w-full h-full overflow-y-auto">
        <div class="p-4 flex flex-col gap-4">
			<FileUpload mode="basic" name="newFiles[]" accept="*" @select="upload" :auto="true" chooseLabel="Dodaj plik"/>
			<InputText type="text" v-model="filterText" placeholder="Filtruj listę plików..." class="w-full" />
		</div>
        <DataView
            :value="filteredImages" paginator
            paginatorPosition="top"
            :rows="20"
            layout="grid"
            class="w-full"
            :pt="{
                content:{ class:['grid grid-cols-5 gap-2'] }
            }"
        >
            <template #grid="slotProps">
                <div v-for="(item,i) in slotProps.items" :key="i"
                    class="flex flex-col cursor-pointer overflow-clip"
                    @click="closeDialog(item)"
                    @contextmenu="onImageRightClick">
                    <img :src="item" class="object-cover w-full h-30" loading="lazy"/>
                    <div class="text-xs">{{ item }}</div>
                </div>
            </template>
        </DataView>
    </div>

    <ContextMenu ref="menu" :model="image_menu_items"/>

</template>
